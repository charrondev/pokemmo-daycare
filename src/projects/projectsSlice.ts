/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pokemonSlice, usePokemon } from "@pokemmo/pokemon/pokemonSlice";
import { useActions } from "@pokemmo/utils";
import { useStateSelector } from "@pokemmo/state/reducers";
import { PokeDexMonOptionType } from "@pokemmo/data/pokedex";
import {
    Nature,
    Stat,
    IVRequirements,
    Gender,
    BreedStatus,
    IPokemon,
} from "@pokemmo/pokemon/PokemonTypes";

export interface ProjectFormValues {
    pokemon: PokeDexMonOptionType | null;
    nature: Nature | null;
    averagePrice?: number;
    activeIVs: Stat[];
    ivRequirements: IVRequirements;
    gender: Gender;
    projectName: string;
    allowEvolvedPokemon?: boolean;
    allowedAlternativeIdentifiers: string[];
}

type IDCollection = Record<string, boolean>;
export interface ProjectDataType {
    name: string;
    projectID: string;
    expandedPokemonIDs: IDCollection;
    pokemonID: string | null;
    dateCreated: string;
    lastFormValues: ProjectFormValues | null;
}

interface IProjectsState {
    [projectID: string]: ProjectDataType;
}

type StateWithProject<T extends string> = IProjectsState &
    { [key in T]: ProjectDataType };

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
        initProject: (state, action: PayloadAction<{ projectID: string }>) => {
            const { projectID } = action.payload;
            const now = new Date();
            state[projectID] = {
                projectID,
                pokemonID: null,
                expandedPokemonIDs: {},
                name: UNTITLED_PROJECT,
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
            state[projectID].expandedPokemonIDs[pokemonID] = true;
        },
        collapsePokemon: (
            state,
            action: ProjectPayload<{ pokemonID: string }>,
        ) => {
            const { projectID, pokemonID } = action.payload;
            ensureProject(state as IProjectsState, projectID);
            state[projectID].expandedPokemonIDs[pokemonID] = false;
        },
        setPokemon: (state, action: ProjectPayload<{ pokemonID: string }>) => {
            const { projectID, pokemonID } = action.payload;
            ensureProject(state as IProjectsState, projectID);
            state[projectID].pokemonID = pokemonID;
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
    extraReducers: builder =>
        builder.addCase(
            pokemonSlice.actions.setBreedStatus,
            (state, action) => {
                const { pokemon, status } = action.payload;

                if (status === BreedStatus.USED) {
                    const projects = pokemon.projectIDs.map(id => state[id]);
                    projects.forEach(proj => {
                        proj.expandedPokemonIDs[pokemon.id] = false;
                    });
                }
            },
        ),
});

export function useProjectActions() {
    return useActions(projectsSlice.actions);
}

export function useProject(projectID: string): ProjectDataType | null {
    return useStateSelector(state => state.projects[projectID]);
}

export function useProjectPokemon(projectID: string): IPokemon | null {
    const project = useProject(projectID);
    return usePokemon(project?.pokemonID ?? null);
}
