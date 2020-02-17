/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { BreadcrumbsItem, BreadcrumbsStateless } from "@atlaskit/breadcrumbs";
import React from "react";
import { useParams } from "react-router-dom";
import { PokemonFactory } from "../pokemon/PokemonFactory";
import { usePokemonActions } from "../pokemon/pokemonSlice";
import { PokemonTree } from "./PokemonTree";
import { ProjectForm } from "./ProjectForm";
import {
    useProject,
    useProjectActions,
    useProjectPokemon,
} from "./projectsSlice";

interface IProps {}

const UNTITLED = "(Untitled)";

export function Project(props: IProps) {
    const { projectID } = useParams<{ projectID: string }>();
    const project = useProject(projectID);
    const projectPokemon = useProjectPokemon(projectID);
    const { addPokemon, clearPokemonAndChildren } = usePokemonActions();
    const { setPokemon, stashFormValues } = useProjectActions();

    if (projectID && !project) {
        return <div>Project Not Found</div>;
    }

    return (
        <div>
            <BreadcrumbsStateless>
                <BreadcrumbsItem href={"/projects"} text={"Projects"} />
                <BreadcrumbsItem
                    href={`/projects/${projectID}`}
                    text={project?.lastFormValues?.projectName || UNTITLED}
                />
            </BreadcrumbsStateless>

            {/* <h2>PokeMMO Daycare</h2> */}
            {/* <p>A calculator for breeding pokemon in PokeMMO.</p> */}
            <ProjectForm
                onSubmit={values => {
                    console.log(values);
                    if (!project) {
                        return;
                    }
                    project.pokemonID &&
                        clearPokemonAndChildren({
                            projectID,
                            pokemonID: project.pokemonID,
                        });

                    const {
                        pokemon,
                        allParents,
                    } = PokemonFactory.create(
                        values.pokemon!.pokedexMon.identifier,
                        values.ivRequirements,
                        values.gender,
                        values.nature?.nature ?? null,
                        null,
                        [project.projectID],
                    );

                    addPokemon([pokemon, ...allParents]);
                    setPokemon({ pokemonID: pokemon.uuid, projectID });
                    stashFormValues({ projectID, values });
                }}
                initialValues={project?.lastFormValues ?? undefined}
            />
            {projectPokemon && project && (
                <PokemonTree projectID={project.projectID} />
            )}
        </div>
    );
}
