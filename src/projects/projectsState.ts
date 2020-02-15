/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useActions, uuidv4 } from "./utils";
import { PokemonType } from "../utils/Pokemon";
import { ProjectFormValues } from "./ProjectForm";

interface IDCollection {
    [uuid: string]: boolean;
}

interface IProjectData {
    name: string;
    projectID: string;
    expandedPokemon: IDCollection;
    completedPokemon: IDCollection;
    pokemon: PokemonType | null;
    dateCreated: string;
    lastFormValues: ProjectFormValues | null;
}

interface IProjectsState {
    [projectID: string]: IProjectData;
}

type StateWithProject<T extends string> = IProjectsState &
    { [key in T]: IProjectData };

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

export const projectsSlice = createSlice({
    name: "projects",
    initialState: {} as IProjectsState,
    reducers: {
        initProject: (state, action: PayloadAction<{ projectID: string }>) => {
            const { projectID } = action.payload;
            const now = new Date();
            state[projectID] = {
                projectID,
                pokemon: null,
                expandedPokemon: {},
                completedPokemon: {},
                name: "(Untitled Project)",
                dateCreated: now.toISOString(),
                lastFormValues: null,
            };
        },
        expandPokemon: (
            state,
            action: ProjectPayload<{ pokemonID: string }>,
        ) => {
            const { projectID, pokemonID } = action.payload;
            ensureProject(state as IProjectsState, projectID);
            state[projectID].expandedPokemon[pokemonID] = true;
        },
        collapsePokemon: (
            state,
            action: ProjectPayload<{ pokemonID: string }>,
        ) => {
            const { projectID, pokemonID } = action.payload;
            ensureProject(state as IProjectsState, projectID);
            state[projectID].expandedPokemon[pokemonID] = false;
        },
        setPokemon: (
            state,
            action: ProjectPayload<{ pokemon: PokemonType }>,
        ) => {
            const { projectID, pokemon } = action.payload;
            ensureProject(state as IProjectsState, projectID);
            state[projectID].pokemon = pokemon;
        },
        stashFormValues: (
            state,
            action: ProjectPayload<{ values: ProjectFormValues }>,
        ) => {
            const { projectID, values } = action.payload;
            ensureProject(state as IProjectsState, projectID);
            state[projectID].lastFormValues = values;
        },
    },
});

export function useProjectActions() {
    return useActions(projectsSlice.actions);
}
