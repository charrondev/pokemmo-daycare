/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { rootReducer, RootState } from "@pokemmo/state/reducers";
import { configureStore, Store } from "@reduxjs/toolkit";
import { load, save } from "redux-localstorage-simple";

let storeCache: Store<RootState> | null = null;

export function getStore() {
    if (storeCache) {
        return storeCache;
    }
    const store = configureStore<RootState>({
        reducer: rootReducer,
        middleware: [save({ debounce: 500 })],
        preloadedState: load(),
    });

    // Enable Webpack hot module replacement for reducers
    module.hot?.accept("../reducers", () => {
        const nextRootReducer = require("./reducers");
        store.replaceReducer(nextRootReducer);
    });

    storeCache = store;

    return store;
}
