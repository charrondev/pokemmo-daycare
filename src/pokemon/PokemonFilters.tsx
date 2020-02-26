/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { NatureSelect } from "@pokemmo/pokemon/NatureSelect";
import { PokemonSelect } from "@pokemmo/pokemon/PokemonSelect";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";

export interface IPokemonFilters {
    projectIDs: string[];
    pokemonIdentifiers: string[];
    eggGroups: string[];
    natures: string[];
    hideUsedPokemon: boolean;
}

export const DEFAULT_POKEMON_FILTERS: IPokemonFilters = {
    projectIDs: [],
    pokemonIdentifiers: [],
    eggGroups: [],
    natures: [],
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
            console.log(values);
        },
    });

    return (
        <FormikProvider value={form}>
            <Form className={props.className}>
                <FormHeading
                    title="Pokemon Filters"
                    description="Search all of your existing pokemon. Use the filters to narrow the search."
                />
                <FormLabel label="Pokemon" css={{ marginBottom: 18 }}>
                    <PokemonSelect isMulti fieldName="pokemonIdentifiers" />
                </FormLabel>
                <FormLabel label="Natures" css={{ marginBottom: 18 }}>
                    <NatureSelect isMulti fieldName="natures" />
                </FormLabel>
            </Form>
        </FormikProvider>
    );
}
