/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { LabelAndValue, labelStyle } from "@pokemmo/form/LabelAndValue";
import { Separator } from "@pokemmo/layout/Separator";
import { PokemonBuilder } from "@pokemmo/pokemon/PokemonBuilder";
import {
    useAllPokemon,
    usePokemon,
    usePokemonActions,
} from "@pokemmo/pokemon/pokemonHooks";
import { PokemonMeta } from "@pokemmo/pokemon/PokemonMeta";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import {
    BreedStatus,
    Gender,
    IPokemonBreederStub,
    OwnershipStatus,
} from "@pokemmo/pokemon/PokemonTypes";
import { BreedingAttachButton } from "@pokemmo/projects/BreedingAttachButton";
import {
    BreedingItem,
    helpItemForPair,
    IBreedingPair,
} from "@pokemmo/projects/breedingUtils";
import { useProject } from "@pokemmo/projects/projectHooks";
import { useStubActions } from "@pokemmo/projects/stubSlice";
import { Card } from "@pokemmo/styles/Card";
import { fontSizeLarge, makeSingleBorder } from "@pokemmo/styles/variables";
import { numberWithCommas, uppercaseFirst } from "@pokemmo/utils";
import { sample } from "lodash-es";
import React, { useDebugValue } from "react";

interface IProps {
    projectID: string;
}

export function BreedingGuide(props: IProps) {
    const pokemonByID = useAllPokemon();
    const allPairs = useBreederStubPairs(props.projectID);

    const eggPairs: IBreedingPair[] = [];
    const readyPairs: IBreedingPair[] = [];
    const notReadyPairs: IBreedingPair[] = [];
    const completePairs: IBreedingPair[] = [];

    allPairs.forEach(pair => {
        if (!pair.parents) {
            return;
            // Don't show.
        }

        const ownPokemon =
            pair.stub.attachedPokemonID &&
            pokemonByID[pair.stub.attachedPokemonID];
        if (ownPokemon) {
            if (ownPokemon.breedStatus === BreedStatus.EGG) {
                eggPairs.push(pair);
                return;
            } else {
                completePairs.push(pair);
                return;
            }
        }

        const { male, female } = pair.parents;
        if (
            pair.parents &&
            male.attachedPokemonID &&
            female.attachedPokemonID
        ) {
            const malePokemon = pokemonByID[male.attachedPokemonID];
            const femalePokemon = pokemonByID[female.attachedPokemonID];

            if (
                malePokemon?.breedStatus === BreedStatus.NONE &&
                femalePokemon?.breedStatus === BreedStatus.NONE
            ) {
                readyPairs.push(pair);
                return;
            }
        }

        notReadyPairs.push(pair);
    });
    return (
        <div>
            <FormHeading
                title="Breeding Guide"
                description="Get an estimation of the order to breed the pokemon that minimizes cost. Track your progress so you don’t repeat steps."
            />
            {eggPairs.length > 0 && (
                <>
                    <FormHeading title="Eggs" asElement="h3" />
                    {eggPairs.map((pair, i) => {
                        return (
                            <BreederPair
                                projectID={props.projectID}
                                pair={pair}
                                key={i}
                            />
                        );
                    })}
                </>
            )}
            {readyPairs.length > 0 && (
                <>
                    <FormHeading title="Ready to Breed" asElement="h3" />
                    {readyPairs.map((pair, i) => {
                        return (
                            <BreederPair
                                projectID={props.projectID}
                                pair={pair}
                                key={i}
                            />
                        );
                    })}
                </>
            )}

            {notReadyPairs.length > 0 && (
                <>
                    <FormHeading title="Not Ready" asElement="h3" />
                    {notReadyPairs.map((pair, i) => {
                        return (
                            <BreederPair
                                projectID={props.projectID}
                                pair={pair}
                                key={i}
                            />
                        );
                    })}
                </>
            )}
            {completePairs.length > 0 && (
                <>
                    <FormHeading title="Complete" asElement="h3" />
                    {completePairs.map((pair, i) => {
                        return (
                            <BreederPair
                                projectID={props.projectID}
                                pair={pair}
                                key={i}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
}

function BreederPair(props: { pair: IBreedingPair; projectID: string }) {
    const { pair, projectID } = props;
    const childPokemon = usePokemon(pair.stub.attachedPokemonID);
    const { attachPokemonToStub } = useStubActions();
    const { setBreedStatus, addPokemon } = usePokemonActions();
    const femaleParent = usePokemon(
        pair.parents?.female.attachedPokemonID ?? null,
    );

    if (!pair.parents) {
        return null;
    }
    const { male, female } = pair.parents;

    if (!male || !female) {
        // Don't show stubs without parents. They don't need to be bred.
        return null;
    }

    const heldItems = helpItemForPair(pair);
    const hasAttachedParents =
        !!male.attachedPokemonID && !!female.attachedPokemonID;
    const isEgg = childPokemon?.breedStatus === BreedStatus.EGG;
    const isUsed = childPokemon?.breedStatus === BreedStatus.USED;
    const canBreed = hasAttachedParents && !isEgg && !isUsed;

    return (
        <Card
            css={{ marginBottom: 24, display: "flex", alignItems: "stretch" }}
        >
            <div css={{ flex: 1 }}>
                <BreederPart
                    projectID={projectID}
                    stub={male}
                    heldItem={heldItems.male}
                />
                <Separator horizontal />
                <BreederPart
                    projectID={projectID}
                    stub={female}
                    heldItem={heldItems.female}
                />
            </div>
            <div
                css={{
                    flex: "0 1 auto",
                    minWidth: 140,
                    justifyContent: "center",
                    paddingLeft: 18,
                    display: "flex",
                    alignItems: "center",
                    borderLeft: makeSingleBorder(1),
                }}
            >
                {isEgg ? (
                    <FormButton
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => {
                            setBreedStatus({
                                pokemonID: pair.stub.attachedPokemonID!,
                                status: BreedStatus.USED,
                            });
                        }}
                    >
                        Hatch{" "}
                        <span css={{ fontWeight: 500 }}>
                            {pair.stub.gender === Gender.MALE ? "♂" : "♀"}
                        </span>
                    </FormButton>
                ) : (
                    <FormButton
                        disabled={!canBreed}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => {
                            // We have to make a new pokemon from the stub.
                            if (femaleParent) {
                                const pokemon = PokemonBuilder.create(
                                    femaleParent.identifier,
                                )
                                    .breedStatus(BreedStatus.EGG)
                                    .gender(pair.stub.gender)
                                    .nature(pair.stub.nature)
                                    .projectIDs([projectID])
                                    .ownershipStatus(OwnershipStatus.BRED)
                                    .ivs(pair.stub.ivs)
                                    .result();
                                addPokemon([pokemon]);

                                attachPokemonToStub({
                                    pokemonID: pokemon.id,
                                    stubHash: pair.stub.stubHash,
                                    stubID: pair.stub.stubID,
                                    projectID,
                                });
                            }

                            if (pair.parents?.male.attachedPokemonID) {
                                setBreedStatus({
                                    pokemonID:
                                        pair.parents.male.attachedPokemonID,
                                    status: BreedStatus.USED,
                                });
                            }

                            if (pair.parents?.female.attachedPokemonID) {
                                setBreedStatus({
                                    pokemonID:
                                        pair.parents.female.attachedPokemonID,
                                    status: BreedStatus.USED,
                                });
                            }
                        }}
                    >
                        Breed{" "}
                        <span css={{ fontWeight: 500 }}>
                            {pair.stub.gender === Gender.MALE ? "♂" : "♀"}
                        </span>
                    </FormButton>
                )}
            </div>
        </Card>
    );
}

function BreederPart(props: {
    projectID: string;
    stub: IPokemonBreederStub;
    heldItem: BreedingItem | null;
}) {
    const { stub, projectID } = props;
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
        <div css={[{ display: "flex", alignItems: "center" }]}>
            <PokemonSprite
                dexMon={dexMon}
                height={50}
                width={50}
                css={!canBreed && { opacity: 0.5 }}
            />
            <div
                css={{
                    marginLeft: 18,
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <div
                    css={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                    <div
                        css={[
                            {
                                ...labelStyle,
                                paddingLeft: 4,
                                fontWeight: "bold",
                                fontSize: fontSizeLarge,
                            },
                            !canBreed && { opacity: 0.5 },
                        ]}
                    >
                        {dexMon.displayName}
                    </div>
                    <div
                        css={[
                            {
                                flex: 1,
                                display: "flex",
                                alignItems: "baseline",
                                flexWrap: "wrap",

                                "& > *": {
                                    marginRight: 18,
                                },
                            },
                            !canBreed && { opacity: 0.5 },
                        ]}
                    >
                        <PokemonMeta
                            ivs={pokemon?.ivs ?? stub.ivs}
                            nature={stub.nature}
                            gender={stub.gender}
                        />
                    </div>
                </div>
                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                        "& > *": {
                            marginRight: 12,
                            minWidth: 140,
                        },
                    }}
                >
                    <LabelAndValue
                        label="Held Item"
                        vertical
                        css={!canBreed && { opacity: 0.5 }}
                    >
                        {props.heldItem ?? "N/A"}
                    </LabelAndValue>
                    <LabelAndValue
                        label="Ownership"
                        vertical
                        css={!canBreed && { opacity: 0.5 }}
                    >
                        {ownStatus
                            ? uppercaseFirst(ownStatus) +
                              (boughtPrice
                                  ? ` (¥${numberWithCommas(boughtPrice)})`
                                  : "")
                            : "Not Owned"}
                    </LabelAndValue>
                    <BreedingAttachButton
                        buttonType={ButtonType.STANDARD}
                        stub={stub}
                        projectID={projectID}
                        css={{ minWidth: "70 !important", marginRight: 24 }}
                    />
                </div>
            </div>
        </div>
    );
}

function useBreederStubPairs(projectID: string) {
    const project = useProject(projectID);

    if (!project) {
        throw new Error("Unknown Project");
    }

    const allStubsByStubHash = project.breederStubs;
    const allStubs = Object.values(allStubsByStubHash).flat();

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

function stubStatCount(pair: IBreedingPair) {
    let count = Object.values(pair.stub.ivs).filter(
        iv => iv.value !== 0 && iv.value != null,
    ).length;

    if (pair.stub.nature) {
        count++;
    }

    return count;
}

function stubHasOwnedParents(pair: IBreedingPair) {
    return (
        pair.parents &&
        pair.parents.male.attachedPokemonID &&
        pair.parents.female.attachedPokemonID
    );
}

function stubHasAOwnedParent(pair: IBreedingPair) {
    return (
        pair.parents &&
        (pair.parents.male.attachedPokemonID ||
            pair.parents.female.attachedPokemonID)
    );
}
