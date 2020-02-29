/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import styled from "@emotion/styled";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { PageLayout } from "@pokemmo/layout/PageLayout";
import { ProjectListItem } from "@pokemmo/projects/ProjectListitem";
import React from "react";
import { useHistory } from "react-router-dom";

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

export function ProjectList(props: IProps) {
    // const projects = useStateSelector(state => state.projects);
    // const allPokemon = useAllPokemon();

    return (
        <PageLayout
            content={
                <>
                    <HeadingGroup>
                        <h2>Projects</h2>
                        <NewProjectButton />
                    </HeadingGroup>
                    Hello Project List
                </>
            }
            subNav={<ProjectListNav />}
        />
    );
}

function ProjectListNav() {
    return (
        <>
            <h2>Project List</h2>
            <ul>
                <ProjectListItem project={{} as any}></ProjectListItem>
                <ProjectListItem project={{} as any}></ProjectListItem>
            </ul>
        </>
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
