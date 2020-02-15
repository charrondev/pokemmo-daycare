/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useStateSelector } from "../state/reducers";
import { Pokemon } from "../utils/Pokemon";
import { PokemonTree } from "./PokemonTree";
import { ProjectForm } from "./ProjectForm";
import { useProjectActions } from "./projectsState";

interface IProps {}

const UNTITLED = "(Untitled)";

export function Project(props: IProps) {
    const { projectID } = useParams<{ projectID: string }>();
    const project = useStateSelector(state => state.projects[projectID]);
    const { setPokemon, stashFormValues } = useProjectActions();

    if (projectID && !project) {
        return <div>Project Not Found</div>;
    }

    return (
        <div className="App-content">
            <BreadcrumbsStateless>
                <BreadcrumbsItem href={"/projects"} text={"Projects"} />
                <BreadcrumbsItem
                    href={`/projects/${projectID}`}
                    text={project.lastFormValues?.projectName || UNTITLED}
                />
            </BreadcrumbsStateless>

            {/* <h2>PokeMMO Daycare</h2> */}
            {/* <p>A calculator for breeding pokemon in PokeMMO.</p> */}
            <ProjectForm
                onSubmit={values => {
                    const pokemon = new Pokemon(
                        values.pokemon!.pokedexMon.name,
                        values.ivRequirements,
                        values.gender,
                        values.nature?.nature ?? null,
                    );
                    console.log(pokemon);
                    setPokemon({ pokemon, projectID });
                    stashFormValues({ projectID, values });
                }}
                initialValues={project.lastFormValues ?? undefined}
            />
            {project.pokemon && <PokemonTree pokemon={project.pokemon} />}
        </div>
    );
}
