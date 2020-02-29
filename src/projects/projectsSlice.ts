/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { pokemonSlice } from "@pokemmo/pokemon/pokemonSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProject {
    projectName: string;
    projectID: string;
    targetPokemonID: string;
    allPokemonIDs: string[];
    pokemonID: string | null;
    dateCreated: string;
    dateUpdated: string;
}

interface IProjectsState {
    [projectID: string]: IProject;
}

type StateWithProject<T extends string> = IProjectsState &
    { [key in T]: IProject };

type ProjectPayload<T> = PayloadAction<
    T & {
        projectID: string;
    }
>;

function ensureProject(
    data: IProjectsState,
    id: string,
): data is StateWithProject<typeof id> {
    return id in data;
}

export const UNTITLED_PROJECT = "(Untitled Project)";

export const projectsSlice = createSlice({
    name: "projects",
    initialState: {} as IProjectsState,
    reducers: {
        setPokemon: (state, action: ProjectPayload<{ pokemonID: string }>) => {
            const { projectID, pokemonID } = action.payload;
            ensureProject(state as IProjectsState, projectID);
            state[projectID].pokemonID = pokemonID;
        },
    },
    extraReducers: builder =>
        builder.addCase(
            pokemonSlice.actions.setBreedStatus,
            (state, action) => {
                // const { pokemon, status } = action.payload;
                // if (status === BreedStatus.USED) {
                // const projects = pokemon.projectIDs.map(id => state[id]);
                // projects.forEach(proj => {
                //     proj.expandedPokemonIDs[pokemon.id] = false;
                // });
                // }
            },
        ),
});
