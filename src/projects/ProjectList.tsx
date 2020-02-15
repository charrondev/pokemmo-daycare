/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { Button } from "@atlaskit/button/dist/cjs/components/Button";
import DynamicTable from "@atlaskit/dynamic-table";
import React from "react";
import { useHistory } from "react-router-dom";
import { useStateSelector } from "../state/reducers";
import { IVView } from "./IVView";
import { useProjectActions } from "./projectsState";
import { uuidv4 } from "./utils";
import styled from "styled-components";

interface IProps {}

enum SortKey {
    PROJECT_NAME = "projectName",
    POKEMON_NAME = "pokemonName",
    DATE_CREATED = "dateCreated",
}

const HeadingGroup = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
`;

export function ProjectList(props: IProps) {
    const projects = useStateSelector(state => state.projects);

    return (
        <div>
            <HeadingGroup>
                <h2>NatureOptionType</h2>
                <NewProjectButton />
            </HeadingGroup>
            <DynamicTable
                head={{
                    cells: [
                        {
                            content: "Project Name",
                            isSortable: true,
                            key: SortKey.PROJECT_NAME,
                        },
                        {
                            content: "Pokemon",
                            isSortable: true,
                            key: SortKey.POKEMON_NAME,
                        },
                        { content: "Stats", isSortable: false },
                        {
                            content: "Date Updated",
                            isSortable: true,
                            key: SortKey.DATE_CREATED,
                        },
                    ],
                }}
                rows={Object.values(projects).map(project => {
                    return {
                        key: project.projectID,
                        cells: [
                            {
                                key: SortKey.PROJECT_NAME,
                                content: (
                                    <div>
                                        <a
                                            href={`/projects/${project.projectID}`}
                                        >
                                            {project.name}
                                        </a>
                                    </div>
                                ),
                            },
                            {
                                key: SortKey.POKEMON_NAME,
                                content: <div>{project.pokemon?.name}</div>,
                            },
                            {
                                content: project.pokemon && (
                                    <IVView
                                        ivRequirements={
                                            project.pokemon.ivRequirements
                                        }
                                    />
                                ),
                            },
                            {
                                key: SortKey.DATE_CREATED,
                                content: <div>{project.dateCreated}</div>,
                            },
                        ],
                    };
                })}
                // rowsPerPage={10}
                // defaultPage={1}
                // loadingSpinnerSize="large"
                // isLoading={false}
                // isFixedSize
                defaultSortKey={SortKey.DATE_CREATED}
                defaultSortOrder="ASC"
                onSort={() => console.log("onSort")}
                onSetPage={() => console.log("onSetPage")}
                emptyView={<NewProjectButton />}
            />
        </div>
    );
}

function NewProjectButton() {
    const history = useHistory();
    const { initProject } = useProjectActions();

    return (
        <Button
            appearance="primary"
            onClick={() => {
                const projectID = uuidv4();
                initProject({ projectID });
                history.push(`/projects/${projectID}`);
            }}
        >
            New Project
        </Button>
    );
}
