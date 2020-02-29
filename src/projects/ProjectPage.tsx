/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import styled from "@emotion/styled";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { PageLayout } from "@pokemmo/layout/PageLayout";
import { PokemonGridItem } from "@pokemmo/pokemon/PokemonGridItem";
import {
    useAllProjects,
    useProject,
    useProjectPokemon,
} from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { ProjectView } from "@pokemmo/projects/ProjectView";
import React from "react";
import { useHistory, useParams } from "react-router-dom";

interface IProps {}

// enum SortKey {
//     PROJECT_NAME = "projectName",
//     POKEMON_NAME = "pokemonName",
//     DATE_CREATED = "dateCreated",
// }

const HeadingGroup = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
`;

export function ProjectPage(props: IProps) {
    // const projects = useStateSelector(state => state.projects);
    const { projectID } = useParams<{ projectID: string }>();
    let content: React.ReactNode = "No Project Selected";
    const project = useProject(projectID);
    if (project) {
        content = <ProjectView project={project} />;
    }

    return <PageLayout content={content} subNav={<ProjectListNav />} />;
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
    return (
        <PokemonGridItem
            css={{ marginBottom: 18 }}
            onClick={() => history.push(`/projects/${props.project.projectID}`)}
            pokemon={projectPokemon}
            nameOverride={props.project.projectName || "(Untitled Project)"}
        />
    );
}

function NewProjectButton() {
    const history = useHistory();
    // const { initProject } = useProjectActions();

    return (
        <FormButton
            buttonType={ButtonType.PRIMARY}
            onClick={() => {
                // const projectID = uuidv4();
                // initProject({ projectID });
                history.push(`/projects/new`);
            }}
        >
            New Project
        </FormButton>
    );
}
