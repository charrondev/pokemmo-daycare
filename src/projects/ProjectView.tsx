/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
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

function ProjectShoppingList(props: { project: IProject }) {
    return (
        <>
            <FormHeading
                actions={
                    <FormButton buttonType={ButtonType.PRIMARY}>
                        Add Pokemon
                    </FormButton>
                }
                title={
                    <>
                        Shopping/Catching List{" "}
                        <span css={{ fontWeight: "normal" }}>(4/31)</span>
                    </>
                }
                description={
                    <>
                        In order to breed this pokemon, you will need to
                        purchase or catch the following pokemon & items. If you
                        buy or catch a pokemon that is already already has some
                        desired IVs, just add it to the project.
                        <strong>
                            Estimated spread is to reduce purchasing costs.
                        </strong>
                    </>
                }
            />
        </>
    );
}
