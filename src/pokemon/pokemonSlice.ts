/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PokemonType, PokemonStatus } from "@pokemmo/pokemon/PokemonFactory";
import { useStateSelector } from "@pokemmo/state/reducers";
import { useActions } from "@pokemmo/utils";

export type PokemonByID = Record<string, PokemonType>;

interface IPokemonState {
    pokemonByID: {
        [key: string]: PokemonType;
    };
}

const INITIAL_POKEMON_STATE: IPokemonState = {
    pokemonByID: {},
};

export const pokemonSlice = createSlice({
    name: "projects",
    initialState: INITIAL_POKEMON_STATE,
    reducers: {
        addPokemon: (
            state: IPokemonState,
            action: PayloadAction<PokemonType[]>,
        ) => {
            action.payload.forEach(pokemon => {
                state.pokemonByID[pokemon.uuid] = pokemon;
            });
        },
        clearPokemonAndChildren: (
            state,
            action: PayloadAction<{ pokemonID: string; projectID: string }>,
        ) => {
            const { projectID, pokemonID } = action.payload;
            function clearPokemonAndChildren(pokemonID: string) {
                const pokemon = state.pokemonByID[pokemonID];
                if (!pokemon) {
                    console.warn(
                        `Attempted to delete pokemon ${pokemonID}, but it did not exist`,
                    );
                    return;
                }

                if (
                    pokemon.projectIDs.includes(projectID) &&
                    [PokemonStatus.NONE].includes(pokemon.status)
                ) {
                    const { parentIDs } = pokemon;
                    delete state.pokemonByID[pokemon.uuid];

                    parentIDs &&
                        Object.values(parentIDs).forEach(
                            clearPokemonAndChildren,
                        );
                }
            }
            clearPokemonAndChildren(pokemonID);
        },
        setPokemonStatus: (
            state,
            action: PayloadAction<{
                pokemon: PokemonType;
                status: PokemonStatus;
            }>,
        ) => {
            const { pokemon, status } = action.payload;
            function setStatus(pokemonID: string, status: PokemonStatus) {
                const pokemon = state.pokemonByID[pokemonID];
                if (!pokemon) {
                    console.warn(
                        `Attempted to change the status of pokemonID ${pokemonID}. Pokemon could not be found.`,
                    );
                }

                switch (status) {
                    case PokemonStatus.USED:
                        if (pokemon.parentIDs) {
                            Object.values(pokemon.parentIDs).forEach(id =>
                                setStatus(id, PokemonStatus.USED),
                            );
                        }
                        break;
                    default:
                        break;
                }

                pokemon.status = status;
            }

            setStatus(pokemon.uuid, status);
        },
    },
});

export function useAllPokemon() {
    return useStateSelector(state => state.pokemon.pokemonByID);
}

export function usePokemon(pokemonID: string | null): PokemonType | null {
    return useStateSelector(state => {
        return pokemonID !== null ? state.pokemon.pokemonByID[pokemonID] : null;
    });
}

export function usePokemonCosts(pokemonID: string | null) {
    const allPokemon = useAllPokemon();
    const pokemon = usePokemon(pokemonID);
}

export function usePokemonActions() {
    return useActions(pokemonSlice.actions);
}
