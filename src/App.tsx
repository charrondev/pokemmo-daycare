/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { HelpPage } from "@pokemmo/help/HelpPage";
import { PokemonPage } from "@pokemmo/pokemon/PokemonPage";
import { ProjectPage } from "@pokemmo/projects/ProjectPage";
import { getStore } from "@pokemmo/state/store";
import { CssReset } from "@pokemmo/styles/CssReset";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

function App() {
    return (
        <>
            <CssReset />
            <Provider store={getStore()}>
                <BrowserRouter>
                    <Switch>
                        <Route
                            exact
                            path={[
                                "/projects",
                                "/projects/:projectID",
                                "/projects/add",
                            ]}
                            component={ProjectPage}
                        />
                        <Route path="/pokemon" component={PokemonPage} />
                        <Route path="/help" component={HelpPage} />
                        <Redirect exact from="/" to="/projects" />
                    </Switch>
                </BrowserRouter>
            </Provider>
        </>
    );
}

export default App;
