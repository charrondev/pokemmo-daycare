import "@atlaskit/css-reset";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";
import { createStore } from "./state/store";
import { ProjectList } from "./projects/ProjectList";
import { Project } from "./projects/Project";

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
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
        </Provider>
    );
}

export default App;
