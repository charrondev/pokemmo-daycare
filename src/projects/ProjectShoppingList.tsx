/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { Separator } from "@pokemmo/layout/Separator";
import { Gender, IPokemonBreederStub } from "@pokemmo/pokemon/PokemonTypes";
import { IVView } from "@pokemmo/projects/IVView";
import { useProject } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { mixinExtendContainer } from "@pokemmo/styles/variables";
import { uppercaseFirst } from "@pokemmo/utils";
import React, { useDebugValue } from "react";

export function ProjectShoppingList(props: { project: IProject }) {
    const { project } = props;
    const { projectID, breederStubs, breederPokemonIDs } = project;
    const ownedStubs = useBreederStubs(projectID, true, true);
    const requiredStubs = useBreederStubs(projectID, false, true);

    return (
        <>
            <FormHeading
                actions={
                    <FormButton buttonType={ButtonType.PRIMARY}>
                        Add Pokemon
                    </FormButton>
                }
                title={
                    <>
                        Shopping/Catching List{" "}
                        <span css={{ fontWeight: "normal" }}>(4/31)</span>
                    </>
                }
                description={
                    <>
                        In order to breed this pokemon, you will need to
                        purchase or catch the following pokemon & items. If you
                        buy or catch a pokemon that is already already has some
                        desired IVs, just add it to the project.
                        <strong>
                            Estimated spread is to reduce purchasing costs.
                        </strong>
                    </>
                }
            />
            <FormLabel label="Required">
                <div
                    css={{
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(240px, 1fr))",
                        gridAutoColumns: "max-content",
                        display: "grid",
                        ...mixinExtendContainer(18),
                        marginBottom: 18,
                    }}
                >
                    {Object.values(requiredStubs).map((stubs, i) => {
                        return (
                            <ShoppingListStubItem
                                stubs={stubs}
                                key={i}
                                css={{
                                    margin: 18,
                                }}
                                action={<FormButton>Add</FormButton>}
                            />
                        );
                    })}
                </div>
            </FormLabel>
            <FormLabel label="Owned">
                <div
                    css={{
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(240px, 1fr))",
                        gridAutoColumns: "max-content",
                        display: "grid",
                        ...mixinExtendContainer(18),
                        marginBottom: 18,
                    }}
                >
                    {Object.values(ownedStubs).map((stubs, i) => {
                        return (
                            <ShoppingListStubItem
                                stubs={stubs}
                                key={i}
                                css={{
                                    margin: 18,
                                }}
                            />
                        );
                    })}
                </div>
            </FormLabel>
        </>
    );
}

function ShoppingListStubItem(props: {
    stubs: IPokemonBreederStub[];
    className?: string;
    action?: React.ReactNode;
}) {
    const { stubs } = props;
    const first = stubs[0];

    if (!first) {
        // Shouldn't happen.
        return null;
    }
    let hasStats = false;
    Object.values(first.ivs).forEach(stat => {
        if (stat?.value !== 0) {
            hasStats = true;
        }
    });

    return (
        <DecoratedCard
            itemCount={stubs.length}
            className={props.className}
            css={{
                marginBottom: 18,
                display: "flex",
                alignItems: "stretch",
                justifyContent: "space-between",
            }}
        >
            <div css={{ flex: 1 }}>
                {hasStats && (
                    <LabelAndValue label="Stats" css={{ marginBottom: 6 }}>
                        <IVView ivRequirements={first.ivs} />
                    </LabelAndValue>
                )}
                {first.nature && (
                    <LabelAndValue label="Nature" css={{ marginBottom: 6 }}>
                        {first.nature}
                    </LabelAndValue>
                )}
                <LabelAndValue label="Gender" css={{ marginBottom: 6 }}>
                    {uppercaseFirst(first.gender)}
                    {first.gender === Gender.MALE ? "♂" : "♀"}
                </LabelAndValue>
            </div>
            {props.action && (
                <div css={{ display: "flex", alignItems: "center" }}>
                    <Separator vertical />
                    {props.action}
                </div>
            )}
        </DecoratedCard>
    );
}

function useBreederStubs(
    projectID: string,
    owned: boolean,
    onlyLeaves?: boolean,
): Record<string, IPokemonBreederStub[]> {
    const project = useProject(projectID);

    const result: Record<string, IPokemonBreederStub[]> = {};
    if (project) {
        for (const [stubHash, stubs] of Object.entries(project.breederStubs)) {
            const filtered = stubs.filter(stub => {
                if (onlyLeaves && stub.parents) {
                    return false;
                }

                if (owned && stub.attachedPokemon) {
                    return true;
                } else if (!owned && !stub.attachedPokemon) {
                    return true;
                }

                return false;
            });

            if (filtered.length > 0) {
                result[stubHash] = filtered;
            }
        }
    }

    useDebugValue({ result });

    return result;
}
