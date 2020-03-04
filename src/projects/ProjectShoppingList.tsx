/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { GridLayout, GridSection } from "@pokemmo/layout/GridLayout";
import { Separator } from "@pokemmo/layout/Separator";
import {
    IPokemonFormRequirements,
    PokemonForm,
} from "@pokemmo/pokemon/PokemonForm";
import { PokemonMeta } from "@pokemmo/pokemon/PokemonMeta";
import {
    IPokemonBreederStub,
    IVRequirements,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";
import { colorForStat } from "@pokemmo/projects/IVView";
import { useProject, useProjectActions } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import React, { useDebugValue, useState } from "react";

export function ProjectShoppingList(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const ownedStubs = useBreederStubs(projectID, true, true);
    const requiredStubs = useBreederStubs(projectID, false, true);
    const requiredLength = Object.values(requiredStubs).flat().length;
    const ownedLength = Object.values(ownedStubs).flat().length;
    const totalLength = requiredLength + ownedLength;

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
                        <span css={{ fontWeight: "normal" }}>
                            ({ownedLength}/{totalLength})
                        </span>
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
            <GridLayout>
                {requiredLength > 0 && (
                    <GridSection title="Required">
                        {Object.values(requiredStubs).map((stubs, i) => {
                            return (
                                <ShoppingListStubItem
                                    projectID={projectID}
                                    stubs={stubs}
                                    key={i}
                                    css={{
                                        margin: 18,
                                    }}
                                    type="add"
                                />
                            );
                        })}
                    </GridSection>
                )}
                {ownedLength > 0 && (
                    <GridSection title="Owned">
                        {Object.values(ownedStubs).map((stubs, i) => {
                            return (
                                <ShoppingListStubItem
                                    projectID={projectID}
                                    stubs={stubs}
                                    key={i}
                                    css={{
                                        margin: 18,
                                    }}
                                    type="remove"
                                />
                            );
                        })}
                    </GridSection>
                )}
            </GridLayout>
        </>
    );
}

function ShoppingListStubItem(props: {
    stubs: IPokemonBreederStub[];
    projectID: string;
    className?: string;
    action?: React.ReactNode;
    type: "add" | "remove";
}) {
    const { projectID } = props;
    const { attachPokemonToStub, detachPokemonFromStub } = useProjectActions();
    const [
        newPokemonRequirements,
        setNewPokemonRequirements,
    ] = useState<IPokemonFormRequirements | null>(null);
    const { stubs } = props;
    const first = stubs[0];

    if (!first) {
        // Shouldn't happen.
        return null;
    }

    let firstStat: Stat | null = null;
    for (const [stat, firstStatInfo] of Object.entries(first.ivs)) {
        if (firstStatInfo.value) {
            firstStat = stat as Stat;
        }
    }

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
            decorationColor={colorForStat(firstStat) ?? undefined}
        >
            <div
                css={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                    "& > *:last-child": {
                        marginBottom: 0,
                    },
                }}
            >
                <PokemonMeta
                    ivs={first.ivs}
                    nature={first.nature}
                    gender={first.gender}
                />
            </div>
            <div css={{ display: "flex", alignItems: "center" }}>
                <Separator vertical />
                <FormButton
                    buttonType={ButtonType.TEXT}
                    onClick={() => {
                        if (props.type === "add") {
                            const minimalIVs: Partial<IVRequirements> = {};
                            Object.entries(first.ivs).forEach(
                                ([stat, data]) => {
                                    if (data.value) {
                                        minimalIVs[stat as Stat] = data;
                                    }
                                },
                            );

                            setNewPokemonRequirements({
                                allowedIdentifiers: first.allowedIdentifiers,
                                nature: first.nature ?? undefined,
                                gender: first.gender ?? undefined,
                                requiredIVs:
                                    Object.keys(minimalIVs).length > 0
                                        ? minimalIVs
                                        : undefined,
                            });
                        } else {
                            detachPokemonFromStub({
                                projectID,
                                pokemonID: first.attachedPokemonID!,
                                stubHash: first.stubHash,
                            });
                        }
                    }}
                >
                    {props.type === "add" ? "Add" : "Remove"}
                </FormButton>
            </div>
            {newPokemonRequirements && (
                <PokemonForm
                    requirements={newPokemonRequirements}
                    onDismiss={() => {
                        setNewPokemonRequirements(null);
                    }}
                    afterSubmit={pokemon => {
                        attachPokemonToStub({
                            projectID,
                            pokemonID: pokemon.id,
                            stubHash: first.stubHash,
                        });
                    }}
                />
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

                if (owned && stub.attachedPokemonID) {
                    return true;
                } else if (!owned && !stub.attachedPokemonID) {
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
