/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { BreedStatus, IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { stubSlice } from "@pokemmo/projects/stubSlice";
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
        deletePokemon: (
            state: IPokemonState,
            action: PayloadAction<{ pokemon: IPokemon }>,
        ) => {
            const pokemonID = action.payload.pokemon.id;
            if (state.pokemonByID[pokemonID]) {
                delete state.pokemonByID[pokemonID];
            }
        },
        setBreedStatus: (
            state,
            action: PayloadAction<{
                pokemonID: string;
                status: BreedStatus;
            }>,
        ) => {
            const { pokemonID, status } = action.payload;
            const pokemon = state.pokemonByID[pokemonID];
            pokemon.breedStatus = status;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(stubSlice.actions.attachPokemonToStub, (state, action) => {
                const { projectID, pokemonID } = action.payload;
                const pokemon = state.pokemonByID[pokemonID];
                if (pokemon) {
                    if (pokemon.projectIDs) {
                        pokemon.projectIDs.push(projectID);
                    } else {
                        pokemon.projectIDs = [projectID];
                    }
                }
            })
            .addCase(
                stubSlice.actions.detachPokemonFromStub,
                (state, action) => {
                    const { projectID, pokemonID } = action.payload;
                    const pokemon = state.pokemonByID[pokemonID];
                    if (pokemon) {
                        const ids = new Set(pokemon.projectIDs);
                        ids.delete(projectID);
                        pokemon.projectIDs = [];
                    }
                },
            );
    },
});
