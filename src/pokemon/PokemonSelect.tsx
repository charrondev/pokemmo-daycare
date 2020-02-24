/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { FormSelect } from "@pokemmo/form/FormSelect";
import {
    pokedexOptions,
    loadPokedexOptions,
    makeSpriteUrl,
} from "@pokemmo/data/pokedex";
import { OptionTypeBase, FormatOptionLabelMeta } from "react-select";

interface IProps
    extends Omit<
        React.ComponentProps<typeof FormSelect>,
        "defaultOptions" | "loadOptions" | "formatOptionLabel"
    > {}

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
