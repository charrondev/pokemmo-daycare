/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { IProject, projectsSlice } from "@pokemmo/projects/projectsSlice";
import { useStateSelector } from "@pokemmo/state/reducers";
import { useActions } from "@pokemmo/utils";

export function useProjectActions() {
    return useActions(projectsSlice.actions);
}

export function useProject(projectID: string): IProject | null {
    return useStateSelector(state => state.projects[projectID]);
}

export function useProjectPokemon(projectID: string): IPokemon | null {
    const project = useProject(projectID);
    return usePokemon(project?.pokemonID ?? null);
}
