/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { FormSelect, FormSelectProps } from "@pokemmo/form/FormSelect";
import {
    pokedexOptions,
    loadPokedexOptions,
    makeSpriteUrl,
    PokedexMon,
    PokeDexMonOptionType,
} from "@pokemmo/data/pokedex";
import { OptionTypeBase, FormatOptionLabelMeta } from "react-select";

export type PokemonSelectOptionType = PokeDexMonOptionType;

interface IProps extends FormSelectProps<PokemonSelectOptionType> {}

export function PokemonSelect(props: IProps) {
    return (
        <FormSelect
            isClearable
            {...props}
            defaultOptions={pokedexOptions.slice(0, 20)}
            loadOptions={loadPokedexOptions}
            formatOptionLabel={formatPokemonLabel}
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
