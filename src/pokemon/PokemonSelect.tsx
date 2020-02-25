/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import {
    getPokemon,
    loadPokedexOptions,
    makeSpriteUrl,
    mapDexMonToItem,
    PokeDexMonOptionType,
    pokedexOptions,
} from "@pokemmo/data/pokedex";
import { FormSelect, FormSelectProps } from "@pokemmo/form/FormSelect";
import React from "react";
import { FormatOptionLabelMeta, OptionTypeBase } from "react-select";

export type PokemonSelectOptionType = PokeDexMonOptionType;

interface IProps
    extends Omit<
        FormSelectProps<PokemonSelectOptionType>,
        "formatOptionsLabel" | "options" | "makeOptionFromValue"
    > {}

export function PokemonSelect(props: IProps) {
    return (
        <FormSelect
            isClearable
            {...props}
            defaultOptions={pokedexOptions.slice(0, 20)}
            loadOptions={loadPokedexOptions}
            formatOptionLabel={formatPokemonLabel}
            makeOptionFromValue={value => {
                if (!value) {
                    return null;
                }
                const pokemon = getPokemon(value);
                if (!pokemon) {
                    return null;
                } else {
                    return mapDexMonToItem(pokemon);
                }
            }}
        />
    );
}

const formatPokemonLabel = (
    option: OptionTypeBase,
    meta: FormatOptionLabelMeta<any>,
) => {
    if (!option.pokedexMon || meta.context !== "menu") {
        return option.label;
    }
    return (
        <div
            css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
            }}
        >
            <span
                css={{
                    marginRight: 8,
                }}
            >
                <img
                    src={makeSpriteUrl(option.pokedexMon)}
                    alt={option.label + " sprite"}
                    height="24"
                    width="24"
                    loading="lazy"
                />
            </span>
            <span
                css={{
                    paddingBottom: 0,
                }}
            >
                {option.label}
            </span>
        </div>
    );
};
