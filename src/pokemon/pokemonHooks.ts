/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { pokemonSlice } from "@pokemmo/pokemon/pokemonSlice";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { useStateSelector } from "@pokemmo/state/reducers";
import { useActions } from "@pokemmo/utils";
import { useDebugValue } from "react";

export function useAllPokemon() {
    return useStateSelector(state => state.pokemon.pokemonByID);
}

export function usePokemon(pokemonID: string | null): IPokemon | null {
    const result = useStateSelector(state => {
        return pokemonID !== null ? state.pokemon.pokemonByID[pokemonID] : null;
    });

    useDebugValue(result);
    return result;
}

export function usePokemonActions() {
    return useActions(pokemonSlice.actions);
}
