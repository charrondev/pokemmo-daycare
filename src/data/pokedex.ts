/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { OptionsType, OptionType } from "@atlaskit/select";
import { uppercaseFirst } from "../projects/utils";
import { memoize } from "lodash-es";
const allPokemon: PokedexMon[] = require("../data/pokemon.csv");

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

console.log({ allEggGroups });

export function getPokemon(input: string | number) {
    return allPokemon.find(pokemon => {
        if (typeof input === "number" && Number.isInteger(input)) {
            return pokemon.speciesID === input;
        } else {
            return pokemon.identifier === input;
        }
    });
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
    (
        eggGroup1: string,
        eggGroup2?: string | null,
        allowEvolved?: boolean,
    ): PokedexMon[] => {
        return allPokemon.filter(mon => {
            const match1 =
                mon.eggGroup1 === eggGroup1 || mon.eggGroup2 === eggGroup1;
            const match2 =
                eggGroup2 &&
                (mon.eggGroup1 === eggGroup2 || mon.eggGroup2 === eggGroup2);
            const matchEvolved =
                allowEvolved || mon.evolvesFromSpeciesID == null;
            return (match1 || match2) && matchEvolved;
        });
    },
    fullMemoize,
);

export function makeSpriteUrl(pokemon: PokedexMon, animated?: boolean) {
    return `https://img.pokemondb.net/sprites/black-white/${
        animated ? "anim/" : ""
    }normal/${pokemon.identifier}.${animated ? "gif" : "png"}`;
}

export interface PokeDexMonOptionType extends OptionType {
    pokedexMon: PokedexMon;
}

function mapDexMonToItem(pokedexMon: PokedexMon): PokeDexMonOptionType {
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
        return allPokemon
            .filter(poke => poke.identifier.includes(input.toLowerCase()))
            .map(mapDexMonToItem);
    },
);
