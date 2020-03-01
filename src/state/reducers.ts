/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { pokemonSlice } from "@pokemmo/pokemon/pokemonSlice";
import { projectsSlice } from "@pokemmo/projects/projectsSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const rootReducer = combineReducers({
    projects: projectsSlice.reducer,
    pokemon: pokemonSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function useStateSelector<T>(selector: (state: RootState) => T): T {
    return useSelector(selector);
}
