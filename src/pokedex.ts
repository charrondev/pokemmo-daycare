/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { OptionsType, OptionType } from "@atlaskit/select";
const allPokemon: PokedexMon[] = require("pokedex/lib/pokemon.json");

export function getPokemon(input: string | number) {
    return allPokemon.find(pokemon => {
        if (typeof input === "number" && Number.isInteger(input)) {
            return pokemon.species_id === input;
        } else {
            return pokemon.name === input;
        }
    });
}

export interface PokedexMon {
    id: number;
    species_id: number;
    height: number;
    weight: number;
    base_experience: number;
    order: number;
    is_default: number;
    name: string;
    sprites: {
        normal: string;
        animated: string;
    };
}

export interface PokeDexMonOptionType extends OptionType {
    pokedexMon: PokedexMon;
}

function uppercaseFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.substring(1);
}

function mapDexMonToItem(pokedexMon: PokedexMon): PokeDexMonOptionType {
    return {
        label: uppercaseFirst(pokedexMon.name),
        value: pokedexMon.id,
        pokedexMon
    };
}

export const pokedexOptions: OptionsType<PokeDexMonOptionType> = allPokemon.map(
    mapDexMonToItem
);

export const loadPokedexOptions = async (
    input: string
): Promise<OptionsType<PokeDexMonOptionType>> => {
    return allPokemon
        .filter(
            poke =>
                poke.name.includes(input.toLowerCase()) &&
                !poke.name.includes("-") &&
                !poke.sprites.normal.includes("x-y")
        )
        .map(mapDexMonToItem);
};
