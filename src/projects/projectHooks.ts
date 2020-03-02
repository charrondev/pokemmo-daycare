/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { IProject, projectsSlice } from "@pokemmo/projects/projectsSlice";
import { useStateSelector } from "@pokemmo/state/reducers";
import { useActions } from "@pokemmo/utils";
import { useDebugValue } from "react";

export function useProjectActions() {
    return useActions(projectsSlice.actions);
}

export function useAllProjects() {
    return useStateSelector(state => state.projects.projectsByID);
}

export function useProject(projectID?: string | null): IProject | null {
    const project = useStateSelector(state =>
        projectID ? state.projects.projectsByID[projectID] : null,
    );

    useDebugValue({ project });
    return project;
}

export function useProjectPokemon(projectID: string): IPokemon | null {
    const project = useProject(projectID);
    const pokemon = usePokemon(project?.targetPokemonID ?? null);
    useDebugValue({ project, pokemon });
    return pokemon;
}

export function useProjectCount() {
    return useStateSelector(state => {
        return Object.keys(state.projects.projectsByID).length;
    });
}
