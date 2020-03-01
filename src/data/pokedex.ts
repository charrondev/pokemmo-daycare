/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { useAllPokemon } from "@pokemmo/pokemon/pokemonHooks";
import { getStore } from "@pokemmo/state/store";
import { uppercaseFirst } from "@pokemmo/utils";
import { memoize } from "lodash-es";
import { OptionsType, OptionTypeBase } from "react-select";
const allPokemon: PokedexMon[] = require("@pokemmo/data/pokemon.csv");

export const allEggGroups = Array.from(
    allPokemon.reduce((eggGroups: Set<string>, pokemon) => {
        eggGroups.add(pokemon.eggGroup1);
        if (pokemon.eggGroup2) {
            eggGroups.add(pokemon.eggGroup2);
        }
        return eggGroups;
    }, new Set<string>()),
);

const allPokemonByIdentifier: Record<string, PokedexMon> = {};
allPokemon.forEach(mon => {
    allPokemonByIdentifier[mon.identifier] = mon;
});

export function getPokemon(input?: string | null) {
    if (input == null) {
        return input;
    }
    return allPokemonByIdentifier[input];
}

export interface PokedexMon {
    speciesID: 0;
    displayName: string;
    identifier: string;
    eggGroup1: string;
    eggGroup2: string | null;
    percentageMale: number;
    captureRate: number;
    evolvesFromSpeciesID: number;
    evolveChainID: number;
    type1: string;
    type2: string | null;
    generation: number;
    isLegendary: boolean;
    isBaby: boolean;
}

const fullMemoize = (...args: any[]) => {
    return JSON.stringify(args);
};

export const pokemonForEggGroup = memoize(
    (eggGroup1: string, eggGroup2?: string | null, allowEvolved?: boolean) => {
        const pokemon: PokedexMon[] = allPokemon.filter(mon => {
            const match1 =
                mon.eggGroup1 === eggGroup1 || mon.eggGroup2 === eggGroup1;
            const match2 =
                eggGroup2 &&
                (mon.eggGroup1 === eggGroup2 || mon.eggGroup2 === eggGroup2);
            const matchEvolved =
                allowEvolved || mon.evolvesFromSpeciesID == null;
            return (match1 || match2) && matchEvolved;
        });

        return pokemon;
    },
    fullMemoize,
);

export function makeSpriteUrl(pokemon: PokedexMon, animated?: boolean) {
    let id = pokemon.speciesID.toString();
    if (id.length === 1) {
        id = "00" + id;
    }

    if (id.length === 2) {
        id = "0" + id;
    }
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/${
        animated ? "full" : "detail"
    }/${id}.png`;
    // return `https://img.pokemondb.net/sprites/black-white/${
    //     animated ? "anim/" : ""
    // }normal/${pokemon.identifier}.${animated ? "gif" : "png"}`;
}

export interface PokeDexMonOptionType extends OptionTypeBase {
    pokedexMon: PokedexMon;
    label: string;
    value: string;
}

export function mapDexMonToItem(pokedexMon: PokedexMon): PokeDexMonOptionType {
    return {
        label: uppercaseFirst(pokedexMon.displayName),
        value: pokedexMon.identifier,
        pokedexMon,
    };
}

// Dex options

export const pokedexOptions: OptionsType<PokeDexMonOptionType> = allPokemon.map(
    mapDexMonToItem,
);

export const loadPokedexOptionsSync = (filter: string | null) =>
    pokedexOptions.filter(poke =>
        filter
            ? poke.pokedexMon.identifier.includes(filter.toLowerCase())
            : true,
    );

export const loadPokedexOptions = (filter: string | null) => {
    return Promise.resolve(loadPokedexOptionsSync(filter));
};

export const filterLoadedDexOptions = (
    filterMethod: (dexOption: PokeDexMonOptionType) => boolean,
    optionLoader: typeof loadPokedexOptions = loadPokedexOptions,
) => async (input: string | null) => {
    const options = await optionLoader(input);
    return options.filter(filterMethod).slice(0, 20);
};

export const filterLoadedDexOptionsSync = (
    filterMethod: (dexOption: PokeDexMonOptionType) => boolean,
    optionLoader: typeof loadPokedexOptionsSync = loadPokedexOptionsSync,
) => (input: string | null) => {
    const options = optionLoader(input);
    return options.filter(filterMethod).slice(0, 20);
};

export const loadOwnPokemonOptionsSync = (filter: string | null) => {
    const ownPokemon = getStore().getState().pokemon.pokemonByID;
    const results: PokeDexMonOptionType[] = [];

    const alreadyFound: string[] = [];
    for (const pokemon of Object.values(ownPokemon)) {
        if (alreadyFound.includes(pokemon.identifier)) {
            continue;
        }

        if (filter !== null && !pokemon.identifier.includes(filter)) {
            continue;
        }

        alreadyFound.push(pokemon.identifier);
        results.push(
            mapDexMonToItem(allPokemonByIdentifier[pokemon.identifier]),
        );
    }

    return results;
};

export const loadOwnPokemonOptions = (filter: string | null) => {
    return Promise.resolve(loadOwnPokemonOptionsSync(filter));
};

// Egg Group Options

export function useOwnEggGroups() {
    // Purely for refresh on change.
    useAllPokemon();

    // Actual filtering.
    const ownPokemonOptions = loadOwnPokemonOptionsSync(null);
    const results: string[] = [];

    for (const option of Object.values(ownPokemonOptions)) {
        const { pokedexMon } = option;
        if (!results.includes(pokedexMon.eggGroup1)) {
            results.push(pokedexMon.eggGroup1);
        }

        if (pokedexMon.eggGroup2 && !results.includes(pokedexMon.eggGroup2)) {
            results.push(pokedexMon.eggGroup2);
        }
    }

    return results;
}

export function stringToOption(str: string) {
    return {
        label: str,
        value: str,
    };
}
