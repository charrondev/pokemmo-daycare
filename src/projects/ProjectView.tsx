/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInput } from "@pokemmo/form/FormInput";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { useProjectActions } from "@pokemmo/projects/projectHooks";
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
    const dexMon = getPokemon(projectPokemon?.identifier)!;

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
            <FormRow
                css={{ alignItems: "center " }}
                itemStyles={{
                    minWidth: 140,
                    flex: "auto",
                    flexGrow: 0,
                    marginRight: 36,
                }}
            >
                <PokemonSprite
                    dexMon={dexMon}
                    height={120}
                    width={150}
                    css={{ flexGrow: 0 }}
                />
                <DecoratedCard>
                    <LabelAndValue vertical label="Name">
                        {dexMon.displayName}
                    </LabelAndValue>
                </DecoratedCard>
                <DecoratedCard>
                    <LabelAndValue vertical label="Nature">
                        {projectPokemon?.nature}
                    </LabelAndValue>
                </DecoratedCard>
                <DecoratedCard>
                    <LabelAndValue vertical label="Egg Group 1">
                        {dexMon.eggGroup1}
                    </LabelAndValue>
                </DecoratedCard>
                {dexMon.eggGroup2 && (
                    <DecoratedCard>
                        <LabelAndValue vertical label="Egg Group 1">
                            {dexMon.eggGroup2}
                        </LabelAndValue>
                    </DecoratedCard>
                )}
            </FormRow>
        </div>
    );
}
