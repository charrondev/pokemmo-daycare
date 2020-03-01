/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInput } from "@pokemmo/form/FormInput";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonInfoRow } from "@pokemmo/pokemon/PokemonInfoRow";
import { ProjectAlternativeBreederForm } from "@pokemmo/projects/ProjectAlternativeBreederForm";
import { useProjectActions } from "@pokemmo/projects/projectHooks";
import { ProjectPricingRequirementsForm } from "@pokemmo/projects/ProjectPricingRequirementsForm";
import { ProjectShoppingList } from "@pokemmo/projects/ProjectShoppingList";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { colorPrimary } from "@pokemmo/styles/variables";
import { relativeTime } from "@pokemmo/utils";
import React from "react";

interface IProps {
    project: IProject;
}

interface IProjectViewForm extends IProject {}

export function ProjectView(props: IProps) {
    const { updateProject } = useProjectActions();
    const { project } = props;
    const { projectID } = project;
    const projectPokemon = usePokemon(project.targetPokemonID);

    return (
        <div>
            <FormHeading
                title="Project Information"
                description="Meta information about your Project."
            />
            <FormRow itemStyles={{ marginRight: 18 }}>
                <FormLabel css={{ maxWidth: 400 }} label="Project Name">
                    <FormInput
                        placeholder="Project 1"
                        onChange={projectName =>
                            updateProject({ projectID, projectName })
                        }
                        value={project.projectName}
                    />
                </FormLabel>
                <DecoratedCard
                    css={{ minWidth: "200px !important", flex: 0 }}
                    decorationColor={colorPrimary}
                >
                    <LabelAndValue vertical label="Last Updated">
                        {relativeTime(project.dateUpdated) + " ago"}
                    </LabelAndValue>
                </DecoratedCard>
            </FormRow>
            <FormHeading
                title="Goal Pokemon"
                description="The pokemon you are trying to breed."
            />
            {projectPokemon && <PokemonInfoRow pokemon={projectPokemon} />}
            <ProjectPricingRequirementsForm project={project} />
            <ProjectAlternativeBreederForm project={project} />
            <ProjectShoppingList project={project} />
        </div>
    );
}
