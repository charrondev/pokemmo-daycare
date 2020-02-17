/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { save, load } from "redux-localstorage-simple";

export function createStore() {
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

    return store;
}
