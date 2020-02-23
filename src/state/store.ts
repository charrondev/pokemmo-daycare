/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { configureStore, Store } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import { rootReducer } from "@pokemmo/state/reducers";

let storeCache: Store | null = null;

export function getStore() {
    if (storeCache) {
        return storeCache;
    }
    const store = configureStore({
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
