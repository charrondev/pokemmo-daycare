/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { PageLayout } from "@pokemmo/layout/PageLayout";
import { PokemonGridItem } from "@pokemmo/pokemon/PokemonGridItem";
import { BreedingView } from "@pokemmo/projects/BreedingView";
import {
    useAllProjects,
    useProjectPokemon,
} from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { ProjectView } from "@pokemmo/projects/ProjectView";
import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";

interface IProps {}

// enum SortKey {
//     PROJECT_NAME = "projectName",
//     POKEMON_NAME = "pokemonName",
//     DATE_CREATED = "dateCreated",
// }

export function ProjectPage(props: IProps) {
    return (
        <PageLayout
            content={
                <Switch>
                    <Route
                        exact
                        path={"/projects/:projectID"}
                        component={ProjectView}
                    />
                    <Route
                        exact
                        path={"/projects/:projectID/guide"}
                        component={BreedingView}
                    />
                    <Route
                        exact
                        path="/projects"
                        component={() => {
                            return <div>Project not selected</div>;
                        }}
                    />
                </Switch>
            }
            subNav={<ProjectListNav />}
        />
    );
}

function ProjectListNav() {
    const projects = useAllProjects();
    return (
        <>
            <h2>Project List</h2>
            <ul>
                {Object.values(projects).map(project => {
                    return (
                        <ProjectPreview
                            key={project.projectID}
                            project={project}
                        />
                    );
                })}
            </ul>
        </>
    );
}

function ProjectPreview(props: { project: IProject }) {
    const history = useHistory();
    const projectPokemon = useProjectPokemon(props.project.projectID);
    if (!projectPokemon) {
        return null;
    }

    const isSelected = history.location.pathname.includes(
        props.project.projectID,
    );

    return (
        <PokemonGridItem
            isSelected={isSelected}
            css={{ marginBottom: 18 }}
            onClick={() => history.push(`/projects/${props.project.projectID}`)}
            pokemon={projectPokemon}
            nameOverride={props.project.projectName || "(Untitled Project)"}
        />
    );
}
