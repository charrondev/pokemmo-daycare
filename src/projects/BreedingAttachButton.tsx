/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { Flyout } from "@pokemmo/layout/Flyout";
import { ExistingPokemonChooser } from "@pokemmo/pokemon/ExistingPokemonChooser";
import { IPokemonFilters } from "@pokemmo/pokemon/PokemonFilters";
import {
    IPokemonFormRequirements,
    PokemonForm,
} from "@pokemmo/pokemon/PokemonForm";
import {
    IPokemonBreederStub,
    IVRequirements,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";
import { useStubActions } from "@pokemmo/projects/stubSlice";
import { MenuItem } from "@reach/menu-button";
import React, { useMemo, useState } from "react";

export function BreedingAttachButton(props: {
    buttonType?: ButtonType;
    stub: IPokemonBreederStub;
    projectID: string;
    className?: string;
}) {
    const { stub, projectID, buttonType = ButtonType.TEXT } = props;
    const { attachPokemonToStub, detachPokemonFromStub } = useStubActions();
    const [
        newPokemonRequirements,
        setNewPokemonRequirements,
    ] = useState<IPokemonFormRequirements | null>(null);
    const [
        existingPokemonFilters,
        setExistingPokemonFilters,
    ] = useState<IPokemonFilters | null>(null);

    const allEggGroupsForStub = useMemo(() => {
        const result: Set<string> = new Set();
        stub.allowedIdentifiers.forEach(identifier => {
            const dexMon = getPokemon(identifier);
            if (dexMon) {
                result.add(dexMon.eggGroup1);
                if (dexMon.eggGroup2) {
                    result.add(dexMon.eggGroup2);
                }
            }
        });
        return Array.from(result);
    }, [stub]);

    if (stub.attachedPokemonID) {
        return (
            <FormButton
                className={props.className}
                buttonType={buttonType}
                onClick={() => {
                    detachPokemonFromStub({
                        projectID,
                        pokemonID: stub.attachedPokemonID!,
                        stubHash: stub.stubHash,
                    });
                }}
            >
                Clear
            </FormButton>
        );
    }

    return (
        <>
            <Flyout
                className={props.className}
                buttonContent={"Add"}
                buttonType={buttonType}
                items={
                    <>
                        <MenuItem
                            onSelect={() => {
                                const minimalIVs: Partial<IVRequirements> = {};
                                Object.entries(stub.ivs).forEach(
                                    ([stat, data]) => {
                                        if (data.value) {
                                            minimalIVs[stat as Stat] = data;
                                        }
                                    },
                                );

                                setNewPokemonRequirements({
                                    allowedIdentifiers: stub.allowedIdentifiers,
                                    nature: stub.nature ?? undefined,
                                    gender: stub.gender ?? undefined,
                                    requiredIVs:
                                        Object.keys(minimalIVs).length > 0
                                            ? minimalIVs
                                            : undefined,
                                });
                            }}
                        >
                            New Pokemon
                        </MenuItem>
                        <MenuItem
                            onSelect={() => {
                                setExistingPokemonFilters({
                                    eggGroups: allEggGroupsForStub,
                                    pokemonIdentifiers: stub.allowedIdentifiers,
                                    projectIDs: null,
                                    hideUsedPokemon: true,
                                    hideProjectPokemon: true,
                                    gender: stub.gender,
                                    natures: stub.nature ? [stub.nature] : null,
                                    requiredIVs: stub.ivs,
                                });
                            }}
                        >
                            Existing Pokemon
                        </MenuItem>
                    </>
                }
            />
            {existingPokemonFilters && (
                <ExistingPokemonChooser
                    filters={existingPokemonFilters}
                    onDismiss={() => {
                        setExistingPokemonFilters(null);
                    }}
                    onSelect={pokemon => {
                        attachPokemonToStub({
                            projectID,
                            pokemonID: pokemon.id,
                            stubHash: stub.stubHash,
                        });
                    }}
                />
            )}
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
                            stubHash: stub.stubHash,
                        });
                    }}
                />
            )}
        </>
    );
}
