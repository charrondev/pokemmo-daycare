/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { LabelAndValue, labelStyle } from "@pokemmo/form/LabelAndValue";
import { Separator } from "@pokemmo/layout/Separator";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonMeta } from "@pokemmo/pokemon/PokemonMeta";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { Gender, IPokemonBreederStub } from "@pokemmo/pokemon/PokemonTypes";
import {
    BreedingItem,
    helpItemForPair,
    IBreedingPair,
} from "@pokemmo/projects/breedingUtils";
import { useProject } from "@pokemmo/projects/projectHooks";
import { Card } from "@pokemmo/styles/Card";
import { fontSizeLarge, makeSingleBorder } from "@pokemmo/styles/variables";
import { numberWithCommas, uppercaseFirst } from "@pokemmo/utils";
import { sample } from "lodash-es";
import React, { useDebugValue } from "react";

interface IProps {
    projectID: string;
}

export function BreedingGuide(props: IProps) {
    const pairs = useBreederStubPairs(props.projectID);
    console.log(pairs);
    return (
        <div>
            <FormHeading
                title="Breeding Guide"
                description="Get an estimation of the order to breed the pokemon that minimizes cost. Track your progress so you don’t repeat steps."
            />
            <FormHeading title="Ready to Breed" asElement="h3" />
            {pairs.map((pair, i) => {
                return <BreederPair stubWithParents={pair} key={i} />;
            })}
        </div>
    );
}

function BreederPair(props: { stubWithParents: IBreedingPair }) {
    const { stubWithParents } = props;

    if (!stubWithParents.parents) {
        return null;
    }
    const { male, female } = stubWithParents.parents;

    if (!male || !female) {
        // Don't show stubs without parents. They don't need to be bred.
        return null;
    }

    const heldItems = helpItemForPair(stubWithParents);
    const canBreed = !!male.attachedPokemonID && !!female.attachedPokemonID;

    return (
        <Card
            css={{ marginBottom: 24, display: "flex", alignItems: "stretch" }}
        >
            <div>
                <BreederPart stub={male} heldItem={heldItems.male} />
                <Separator horizontal />
                <BreederPart stub={female} heldItem={heldItems.female} />
            </div>
            <div
                css={{
                    flex: 1,
                    justifyContent: "center",
                    paddingLeft: 18,
                    display: "flex",
                    alignItems: "center",
                    borderLeft: makeSingleBorder(1),
                }}
            >
                <FormButton
                    disabled={!canBreed}
                    buttonType={ButtonType.PRIMARY}
                >
                    Breed
                </FormButton>
            </div>
        </Card>
    );
}

function BreederPart(props: {
    stub: IPokemonBreederStub;
    heldItem: BreedingItem | null;
}) {
    const { stub } = props;
    const pokemon = usePokemon(stub.attachedPokemonID ?? null);

    let pokemonIdentifier =
        pokemon?.identifier ??
        stub.forcedIdentifier ??
        sample(stub.allowedIdentifiers)!;

    const dexMon = getPokemon(pokemonIdentifier);

    if (!dexMon) {
        return null;
    }

    const ownStatus = pokemon?.ownershipStatus;
    const boughtPrice = pokemon?.boughtPrice;
    const canBreed = !!stub.attachedPokemonID;

    return (
        <div
            css={[
                { display: "flex", alignItems: "center" },
                !canBreed && { opacity: 0.5 },
            ]}
        >
            <PokemonSprite dexMon={dexMon} height={50} width={50} />
            <div
                css={{ marginLeft: 18, display: "flex", alignItems: "center" }}
            >
                <div
                    css={{
                        ...labelStyle,
                        fontWeight: "bold",
                        fontSize: fontSizeLarge,
                    }}
                >
                    {dexMon.displayName}
                </div>
                <div
                    css={{
                        width: 500,
                        display: "flex",
                        alignItems: "baseline",
                        flexWrap: "wrap",

                        "& > *": {
                            marginRight: 18,
                        },
                    }}
                >
                    <PokemonMeta
                        ivs={pokemon?.ivs ?? stub.ivs}
                        nature={stub.nature}
                        gender={stub.gender}
                    />
                </div>
                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                        "& > *": {
                            margin: "0 18px",
                            minWidth: 100,
                        },
                    }}
                >
                    <LabelAndValue label="Held Item" vertical>
                        {props.heldItem ?? "N/A"}
                    </LabelAndValue>
                    <LabelAndValue label="Ownership" vertical>
                        {ownStatus
                            ? uppercaseFirst(ownStatus) +
                              (boughtPrice
                                  ? ` (¥${numberWithCommas(boughtPrice)})`
                                  : "")
                            : "Not Owned"}
                    </LabelAndValue>
                </div>
            </div>
            {/* <div><LabelAndValue label="Gender"></LabelAndValue></div> */}
        </div>
    );
}

function useBreederStubPairs(projectID: string) {
    const project = useProject(projectID);

    if (!project) {
        throw new Error("Unknown Project");
    }

    const allStubsByStubHash = project.breederStubs;

    const incompleteStubs: IPokemonBreederStub[] = [];
    const completeStubs: IPokemonBreederStub[] = [];

    for (const stubGroup of Object.values(project.breederStubs)) {
        stubGroup.forEach(stub => {
            if (stub.attachedPokemonID || !stub.parents) {
                completeStubs.push(stub);
            } else {
                incompleteStubs.push(stub);
            }
        });
    }

    const allStubs = [...incompleteStubs, ...completeStubs];

    const matchedStubs: IPokemonBreederStub[] = [];

    const takeStub = (stubHash: string) => {
        const attachedStub = allStubsByStubHash[stubHash]?.find(
            stub => !matchedStubs.includes(stub) && stub.attachedPokemonID,
        );
        const nonAttachedStub = allStubsByStubHash[stubHash]?.find(
            stub => !matchedStubs.includes(stub) && !stub.attachedPokemonID,
        );

        const stubToUse = attachedStub ?? nonAttachedStub;

        if (!stubToUse) {
            throw new Error("should never happen");
        }

        // Drop off the used stub.
        matchedStubs.push(stubToUse);

        return stubToUse;
    };

    const stubsWithParents: IBreedingPair[] = [];

    allStubs.forEach(stub => {
        let parents: Record<Gender, IPokemonBreederStub> | null = null;

        if (stub.parents) {
            parents = {
                [Gender.MALE]: takeStub(stub.parents.male),
                [Gender.FEMALE]: takeStub(stub.parents.female),
            };
        }
        // All of these have parents.
        stubsWithParents.push({
            stub,
            parents,
        });
    });

    const result = stubsWithParents
        .filter(stub => {
            // Filter items with no parents.
            return !!stub.parents;
        })
        .sort((s1, s2) => {
            // Sort the stubsWithParents
            // Put items with owned parents first.
            if (stubHasOwnedParents(s1) && !stubHasOwnedParents(s2)) {
                return -1;
            }

            if (stubHasOwnedParents(s2) && !stubHasOwnedParents(s1)) {
                return 1;
            }

            if (stubHasAOwnedParent(s1) && !stubHasAOwnedParent(s2)) {
                return -1;
            }

            if (stubHasAOwnedParent(s2) && !stubHasAOwnedParent(s1)) {
                return 1;
            }

            // Otherwise filter by stat count.
            if (stubStatCount(s1) > stubStatCount(s2)) {
                return 1;
            }

            if (stubStatCount(s2) > stubStatCount(s1)) {
                return -1;
            }

            return 0;
        });

    useDebugValue({ result });
    return result;
}

function stubStatCount(stubWithParents: IBreedingPair) {
    let count = Object.values(stubWithParents.stub.ivs).filter(
        iv => iv.value !== 0 && iv.value != null,
    ).length;

    if (stubWithParents.stub.nature) {
        count++;
    }

    return count;
}

function stubHasOwnedParents(stubWithParents: IBreedingPair) {
    return (
        stubWithParents.parents &&
        stubWithParents.parents.male.attachedPokemonID &&
        stubWithParents.parents.female.attachedPokemonID
    );
}

function stubHasAOwnedParent(stubWithParents: IBreedingPair) {
    return (
        stubWithParents.parents &&
        (stubWithParents.parents.male.attachedPokemonID ||
            stubWithParents.parents.female.attachedPokemonID)
    );
}
