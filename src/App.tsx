import "@atlaskit/css-reset";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.scss";
import { createStore } from "./state/store";
import { ProjectList } from "./projects/ProjectList";
import { Project } from "./projects/Project";
import { DebugTools } from "./state/DebugTools";

function App() {
    return (
        <Provider store={createStore()}>
            <div className="App">
                <div className="App-content">
                    <BrowserRouter>
                        <Switch>
                            <Route
                                path="/projects"
                                exact
                                component={ProjectList}
                            />
                            <Route
                                path="/projects/:projectID"
                                component={Project}
                                exact
                            />
                            <Redirect exact from="/" to="/projects" />
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
            <DebugTools />
        </Provider>
    );
}

export default App;
