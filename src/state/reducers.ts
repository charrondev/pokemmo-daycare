/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { combineReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { projectsSlice } from "../projects/projectsSlice";
import { pokemonSlice } from "../pokemon/pokemonSlice";

export const rootReducer = combineReducers({
    projects: projectsSlice.reducer,
    pokemon: pokemonSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function useStateSelector<T>(selector: (state: RootState) => T): T {
    return useSelector(selector);
}
