/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { uppercaseFirst } from "@pokemmo/utils";
import { memoize } from "lodash-es";
import { OptionsType, OptionTypeBase } from "react-select";
const allPokemon: PokedexMon[] = require("@pokemmo/data/pokemon.csv");

export const allEggGroups = allPokemon.reduce(
    (eggGroups: Set<string>, pokemon) => {
        eggGroups.add(pokemon.eggGroup1);
        if (pokemon.eggGroup2) {
            eggGroups.add(pokemon.eggGroup2);
        }
        return eggGroups;
    },
    new Set<string>(),
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

export const pokedexOptions: OptionsType<PokeDexMonOptionType> = allPokemon.map(
    mapDexMonToItem,
);

export const loadPokedexOptions = memoize(
    async (input: string): Promise<OptionsType<PokeDexMonOptionType>> => {
        return pokedexOptions
            .filter(poke =>
                poke.pokedexMon.identifier.includes(input.toLowerCase()),
            )
            .slice(0, 20);
    },
);
