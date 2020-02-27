/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { EggGroupSelect } from "@pokemmo/pokemon/EggGroupSelect";
import { NatureSelect } from "@pokemmo/pokemon/NatureSelect";
import { PokemonSelect } from "@pokemmo/pokemon/PokemonSelect";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";

export interface IPokemonFilters {
    projectIDs: string[] | null;
    pokemonIdentifiers: string[] | null;
    eggGroups: string[] | null;
    natures: string[] | null;
    hideUsedPokemon: boolean;
}

export const DEFAULT_POKEMON_FILTERS: IPokemonFilters = {
    projectIDs: null,
    pokemonIdentifiers: null,
    eggGroups: null,
    natures: null,
    hideUsedPokemon: true,
};

interface IProps {
    className?: string;
    filterValues: IPokemonFilters;
    onFilterValuesChange: (newFilters: IPokemonFilters) => void;
}

export function PokemonFilters(props: IProps) {
    const form = useFormik({
        initialValues: props.filterValues,
        onSubmit: values => {
            // do nothing we have no submit
        },
        validateOnBlur: false,
        validateOnMount: false,
        validate: values => {
            // Hijacking for onChange
            props.onFilterValuesChange(values);
        },
    });

    return (
        <FormikProvider value={form}>
            <Form
                className={props.className}
                onChangeCapture={() => {
                    console.log("Form change", form.values);
                }}
            >
                <FormHeading
                    title="Pokemon Filters"
                    description="Search all of your existing pokemon. Use the filters to narrow the search."
                />
                <FormLabel label="Pokemon" css={{ marginBottom: 18 }}>
                    <PokemonSelect
                        isMulti
                        fieldName="pokemonIdentifiers"
                        onlyOwnedPokemon
                    />
                </FormLabel>
                <FormLabel label="Natures" css={{ marginBottom: 18 }}>
                    <NatureSelect isMulti fieldName="natures" onlyOwned />
                </FormLabel>
                <FormLabel label="Egg Groups" css={{ marginBottom: 18 }}>
                    <EggGroupSelect isMulti fieldName="eggGroups" onlyOwned />
                </FormLabel>
            </Form>
        </FormikProvider>
    );
}

export function filterPokemon(
    pokemon: IPokemon[],
    filters: IPokemonFilters,
): IPokemon[] {
    return pokemon.filter(poke => {
        if (
            filters.pokemonIdentifiers &&
            filters.pokemonIdentifiers.length > 0
        ) {
            if (!filters.pokemonIdentifiers.includes(poke.identifier)) {
                return false;
            }
        }

        if (filters.natures && filters.natures.length > 0) {
            if (!poke.nature || !filters.natures.includes(poke.nature)) {
                return false;
            }
        }

        if (filters.eggGroups && filters.eggGroups.length > 0) {
            if (!pokemonHasOneOfEggGroups(poke, filters.eggGroups)) {
                return false;
            }
        }

        return true;
    });
}

export function pokemonHasOneOfEggGroups(
    pokemon: IPokemon,
    eggGroups: string[],
) {
    const dexMon = getPokemon(pokemon.identifier)!;
    const egg1Match = eggGroups.includes(dexMon.eggGroup1);
    const egg2Match = dexMon.eggGroup2 && eggGroups.includes(dexMon.eggGroup2);

    return egg1Match || egg2Match;
}
