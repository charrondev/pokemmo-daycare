/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import {
    FormSelectField,
    FormSelectFieldProps,
    SpecializedSelect,
} from "@pokemmo/form/FormSelect";
import { allNatures, getNature } from "@pokemmo/pokemon/natures";
import { useAllPokemon } from "@pokemmo/pokemon/pokemonHooks";
import { Nature } from "@pokemmo/pokemon/PokemonTypes";
import { NatureView } from "@pokemmo/projects/NatureView";
import { notEmpty } from "@pokemmo/utils";
import React from "react";
import { FormatOptionLabelMeta, OptionTypeBase } from "react-select";

export interface NatureSelectOptionType extends OptionTypeBase {
    nature: Nature;
    label: string;
    value: string;
}

function natureToOption(nature: Nature | null) {
    if (!nature) {
        return null;
    }
    return {
        label: nature.name,
        value: nature.name,
        nature,
    };
}
const allNatureOptions = Object.values(allNatures)
    .map(natureToOption)
    .filter(notEmpty);

function useOwnedNatureOptions() {
    // Purely for refresh on change.
    useAllPokemon();

    // Actual filtering.
    const allPokemon = useAllPokemon();
    const natureNames: string[] = [];

    for (const pokemon of Object.values(allPokemon)) {
        if (pokemon.nature && !natureNames.includes(pokemon.nature)) {
            natureNames.push(pokemon.nature);
        }
    }

    return natureNames
        .map(natureName => natureToOption(getNature(natureName)))
        .filter(notEmpty);
}

interface IProps
    extends SpecializedSelect<FormSelectFieldProps<NatureSelectOptionType>> {
    onlyOwned?: boolean;
    fieldName: string;
}

export function NatureSelect(_props: IProps) {
    const { onlyOwned, ...props } = _props;
    const ownedNatures = useOwnedNatureOptions();
    return (
        <FormSelectField<NatureSelectOptionType>
            isClearable
            {...props}
            options={onlyOwned ? ownedNatures : allNatureOptions}
            formatOptionLabel={formatNatureLabel}
            makeOptionFromValue={value => {
                return natureToOption(getNature(value));
            }}
        />
    );
}
const formatNatureLabel = (
    option: OptionTypeBase,
    meta: FormatOptionLabelMeta<any>,
) => {
    if (meta.context === "menu") {
        return <NatureView nature={option.value} />;
    }
    return option.label;
};
