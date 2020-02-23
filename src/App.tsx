/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { getStore } from "@pokemmo/state/store";
import { ProjectList } from "@pokemmo/projects/ProjectList";
import { Project } from "@pokemmo/projects/Project";
import { CssReset } from "@pokemmo/styles/CssReset";
import { PokemonPage } from "@pokemmo/pokemon/PokemonPage";
import { HelpPage } from "@pokemmo/help/HelpPage";

function App() {
    return (
        <>
            <CssReset />
            <Provider store={getStore()}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/projects" exact component={ProjectList} />
                        <Route
                            path="/projects/:projectID"
                            component={Project}
                            exact
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
