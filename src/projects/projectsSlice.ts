/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { pokemonSlice } from "@pokemmo/pokemon/pokemonSlice";
import { IVRequirements } from "@pokemmo/pokemon/PokemonTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProject {
    projectName: string;
    projectID: string;
    ivPricing: IVRequirements;
    averagePricing: number;
    targetPokemonID: string;
    breederPokemonIDs: string[];
    altBreederIdentifiers: string[];
    allowEvolvedAltBreeders: boolean;
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
    return action.payload.projectID in data.projectsByID;
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
            if (ensureProject(state, action)) {
                handleDates(state, action);
                state.projectsByID[action.payload.projectID] = {
                    ...state.projectsByID[action.payload.projectID],
                    ...action.payload,
                };
            }
        },
        deleteProject: (
            state,
            action: PayloadAction<{ project: IProject }>,
        ) => {
            const { project } = action.payload;
            delete state.projectsByID[project.projectID];
        },
        addAlternative: (
            state,
            action: ProjectPayload<{ alternativeIdentifier: string }>,
        ) => {
            if (ensureProject(state, action)) {
                console.log("found project");
                handleDates(state, action);
                const { projectID, alternativeIdentifier } = action.payload;
                const alternativeSet = new Set(
                    state.projectsByID[projectID].altBreederIdentifiers,
                );
                alternativeSet.add(alternativeIdentifier);
                state.projectsByID[
                    projectID
                ].altBreederIdentifiers = Array.from(alternativeSet);
            }
        },
        clearAlternatives: (state, action: ProjectPayload<{}>) => {
            if (ensureProject(state, action)) {
                handleDates(state, action);
                const { projectID } = action.payload;
                state.projectsByID[projectID].altBreederIdentifiers = [];
            }
        },
        setPokemon: (state, action: ProjectPayload<{ pokemonID: string }>) => {
            if (ensureProject(state, action)) {
                handleDates(state, action);
                const { projectID, pokemonID } = action.payload;
                state.projectsByID[projectID].targetPokemonID = pokemonID;
            }
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
