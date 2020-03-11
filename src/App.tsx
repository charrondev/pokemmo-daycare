/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/core";
import { HelpPage } from "@pokemmo/help/HelpPage";
import { PokemonPage } from "@pokemmo/pokemon/PokemonPage";
import { ProjectPage } from "@pokemmo/projects/ProjectPage";
import { getStore } from "@pokemmo/state/store";
import { CssReset } from "@pokemmo/styles/CssReset";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

const emotionCache = createCache();
emotionCache.compat = true;

console.log("Hello");

function App() {
    return (
        <>
            <CacheProvider value={emotionCache}>
                <CssReset />
                <Provider store={getStore()}>
                    <BrowserRouter>
                        <Switch>
                            <Route path={"/projects"} component={ProjectPage} />
                            <Route path="/pokemon" component={PokemonPage} />
                            <Route path="/help" component={HelpPage} />
                            <Redirect exact from="/" to="/projects" />
                        </Switch>
                    </BrowserRouter>
                </Provider>
            </CacheProvider>
        </>
    );
}

export default App;
