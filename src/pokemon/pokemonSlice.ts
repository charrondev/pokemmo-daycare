/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { BreedStatus, IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { useStateSelector } from "@pokemmo/state/reducers";
import { useActions } from "@pokemmo/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PokemonByID = Record<string, IPokemon>;

interface IPokemonState {
    pokemonByID: {
        [key: string]: IPokemon;
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
            action: PayloadAction<IPokemon[]>,
        ) => {
            action.payload.forEach(pokemon => {
                state.pokemonByID[pokemon.id] = pokemon;
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
                    [BreedStatus.NONE].includes(pokemon.breedStatus)
                ) {
                    const { parentIDs } = pokemon;
                    delete state.pokemonByID[pokemon.id];

                    parentIDs &&
                        Object.values(parentIDs).forEach(
                            clearPokemonAndChildren,
                        );
                }
            }
            clearPokemonAndChildren(pokemonID);
        },
        setBreedStatus: (
            state,
            action: PayloadAction<{
                pokemon: IPokemon;
                status: BreedStatus;
            }>,
        ) => {
            const { pokemon, status } = action.payload;
            function setStatus(pokemonID: string, status: BreedStatus) {
                const pokemon = state.pokemonByID[pokemonID];
                if (!pokemon) {
                    console.warn(
                        `Attempted to change the status of pokemonID ${pokemonID}. Pokemon could not be found.`,
                    );
                }

                switch (status) {
                    case BreedStatus.USED:
                        if (pokemon.parentIDs) {
                            Object.values(pokemon.parentIDs).forEach(id =>
                                setStatus(id, BreedStatus.USED),
                            );
                        }
                        break;
                    default:
                        break;
                }

                pokemon.breedStatus = status;
            }

            setStatus(pokemon.id, status);
        },
    },
});

export function useAllPokemon() {
    return useStateSelector(state => state.pokemon.pokemonByID);
}

export function usePokemon(pokemonID: string | null): IPokemon | null {
    return useStateSelector(state => {
        return pokemonID !== null ? state.pokemon.pokemonByID[pokemonID] : null;
    });
}

export function usePokemonActions() {
    return useActions(pokemonSlice.actions);
}
