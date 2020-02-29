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
    breederPokemonIDs: string[];
    dateCreated: string;
    dateUpdated: string;
}

interface IProjectsState {
    projectsByID: Record<string, IProject>;
}

type StateWithProject<T extends string> = IProjectsState &
    { [key in T]: IProject };

type ProjectPayload<T> = PayloadAction<
    T & {
        projectID: string;
    }
>;

function ensureProject<T>(
    data: IProjectsState,
    action: ProjectPayload<T>,
): data is StateWithProject<typeof action["payload"]["projectID"]> {
    return action.payload.projectID in data;
}

function handleDates(data: IProjectsState, action: ProjectPayload<any>) {
    const { projectID } = action.payload;
    const project = data.projectsByID[projectID];
    if (project) {
        project.dateUpdated = new Date().toISOString();
    }
}

export const UNTITLED_PROJECT = "(Untitled Project)";

export const projectsSlice = createSlice({
    name: "projects",
    initialState: {
        projectsByID: {},
    } as IProjectsState,
    reducers: {
        addProject: (state, action: PayloadAction<{ project: IProject }>) => {
            const { project } = action.payload;
            state.projectsByID[project.projectID] = project;
        },
        updateProject: (state, action: ProjectPayload<Partial<IProject>>) => {
            ensureProject(state, action);
            handleDates(state, action);
            state.projectsByID[action.payload.projectID] = {
                ...state.projectsByID[action.payload.projectID],
                ...action.payload,
            };
        },
        deleteProject: (
            state,
            action: PayloadAction<{ project: IProject }>,
        ) => {
            const { project } = action.payload;
            delete state.projectsByID[project.projectID];
        },
        setPokemon: (state, action: ProjectPayload<{ pokemonID: string }>) => {
            ensureProject(state, action);
            handleDates(state, action);
            const { projectID, pokemonID } = action.payload;
            state.projectsByID[projectID].targetPokemonID = pokemonID;
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
