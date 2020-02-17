/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { Button } from "@atlaskit/button/dist/cjs/components/Button";
import DynamicTable from "@atlaskit/dynamic-table";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useAllPokemon } from "../pokemon/pokemonSlice";
import { useStateSelector } from "../state/reducers";
import { IVView } from "./IVView";
import { PokemonName } from "./PokemonName";
import { useProjectActions, UNTITLED_PROJECT } from "./projectsSlice";
import { uuidv4 } from "./utils";

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
    const allPokemon = useAllPokemon();

    return (
        <div>
            <HeadingGroup>
                <h2>Projects</h2>
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
                    const { pokemonID } = project;
                    const pokemon =
                        pokemonID !== null ? allPokemon[pokemonID] : null;
                    return {
                        key: project.projectID,
                        cells: [
                            {
                                key: project.lastFormValues?.projectName,
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
                                key: pokemon?.name,
                                content: (
                                    <PokemonName
                                        name={pokemon?.name}
                                        withSprite
                                    />
                                ),
                            },
                            {
                                content: pokemon && (
                                    <IVView
                                        ivRequirements={pokemon.ivRequirements}
                                    />
                                ),
                            },
                            {
                                key: project.dateCreated,
                                content: <div>{project.dateCreated}</div>,
                            },
                        ],
                    };
                })}
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
