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
                    <NatureSelect isMulti fieldName="natures" />
                </FormLabel>
            </Form>
        </FormikProvider>
    );
}
