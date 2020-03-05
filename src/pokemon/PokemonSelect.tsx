/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import {
    filterLoadedDexOptions,
    filterLoadedDexOptionsSync,
    getPokemon,
    loadOwnPokemonOptions,
    loadOwnPokemonOptionsSync,
    loadPokedexOptions,
    loadPokedexOptionsSync,
    makeSpriteUrl,
    mapDexMonToItem,
    PokeDexMonOptionType,
} from "@pokemmo/data/pokedex";
import {
    FormSelect,
    FormSelectField,
    FormSelectFieldProps,
    FormSelectProps,
    SpecializedSelect,
} from "@pokemmo/form/FormSelect";
import { Gender } from "@pokemmo/pokemon/PokemonTypes";
import React from "react";
import { FormatOptionLabelMeta, OptionTypeBase } from "react-select";

export type PokemonSelectOptionType = PokeDexMonOptionType;

type IProps = (
    | SpecializedSelect<FormSelectProps<PokemonSelectOptionType>>
    | SpecializedSelect<FormSelectFieldProps<PokemonSelectOptionType>>
) & {
    onlyOwnedPokemon?: boolean;
    eggGroups?: string[];
    excludeIdentifiers?: string[];
    allowedIdentifiers?: string[];
    allowEvolvedPokemon?: boolean;
    forceGender?: string;
};

export function PokemonSelect(_props: IProps) {
    const {
        onlyOwnedPokemon,
        eggGroups,
        excludeIdentifiers,
        allowedIdentifiers,
        allowEvolvedPokemon = true,
        forceGender,
        ...props
    } = _props;

    let loadOptions = loadPokedexOptions;
    let loadInitialOptions = loadPokedexOptionsSync;

    if (onlyOwnedPokemon) {
        loadOptions = loadOwnPokemonOptions;
        loadInitialOptions = loadOwnPokemonOptionsSync;
    }

    const filter = (option: PokeDexMonOptionType) => {
        const { pokedexMon } = option;

        if (forceGender != null) {
            if (
                pokedexMon.percentageMale === 100 &&
                forceGender === Gender.FEMALE
            ) {
                return false;
            } else if (
                pokedexMon.percentageMale === 0 &&
                forceGender === Gender.MALE
            ) {
                return false;
            }
        }

        if (
            excludeIdentifiers &&
            excludeIdentifiers.includes(pokedexMon.identifier)
        ) {
            return false;
        }

        if (
            allowedIdentifiers &&
            !allowedIdentifiers.includes(pokedexMon.identifier)
        ) {
            return false;
        }

        if (!allowEvolvedPokemon && pokedexMon.evolvesFromSpeciesID != null) {
            return false;
        }

        if (eggGroups) {
            const egg1Match = eggGroups.includes(pokedexMon.eggGroup1);
            const egg2Match = pokedexMon.eggGroup2
                ? eggGroups.includes(pokedexMon.eggGroup2)
                : false;

            if (!(egg1Match || egg2Match)) {
                return false;
            }
        }

        return true;
    };
    loadOptions = filterLoadedDexOptions(filter, loadOptions);
    loadInitialOptions = filterLoadedDexOptionsSync(filter, loadInitialOptions);

    let onlyAllowedIdentifier: string | null = null;
    if (allowedIdentifiers && allowedIdentifiers.length === 1) {
        onlyAllowedIdentifier = allowedIdentifiers[0];
    }

    const makeOptionFromValue = (value: any) => {
        if (!value) {
            return null;
        }
        const pokemon = getPokemon(value);
        if (!pokemon) {
            return null;
        } else {
            return mapDexMonToItem(pokemon);
        }
    };

    const finalProps = {
        isDisabled: !!onlyAllowedIdentifier,
        ...props,
        forcedValue: onlyAllowedIdentifier ?? undefined,
        initialValue:
            onlyAllowedIdentifier ?? allowedIdentifiers?.[0] ?? undefined,
        isClearable: !onlyAllowedIdentifier,
        defaultOptions: loadInitialOptions(null),
        loadOptions: loadOptions,
        formatOptionLabel: formatPokemonLabel,
        makeOptionFromValue,
    };
    if ("fieldName" in _props) {
        return <FormSelectField {...finalProps} fieldName={_props.fieldName} />;
    } else {
        return <FormSelect {...(finalProps as any)} />;
    }
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
