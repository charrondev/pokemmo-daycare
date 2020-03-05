/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInput } from "@pokemmo/form/FormInput";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { Breadcrumbs } from "@pokemmo/layout/Breadcrumbs";
import { pageContainerPadding } from "@pokemmo/layout/PageContainer";
import { usePageContentSize } from "@pokemmo/layout/PageContent";
import { PokemonBuilder } from "@pokemmo/pokemon/PokemonBuilder";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonInfoRow } from "@pokemmo/pokemon/PokemonInfoRow";
import { IPokemonBreederStub } from "@pokemmo/pokemon/PokemonTypes";
import { ProjectAlternativeBreederForm } from "@pokemmo/projects/ProjectAlternativeBreederForm";
import {
    useProject,
    useProjectActions,
    useProjectPokemon,
} from "@pokemmo/projects/projectHooks";
import { ProjectPricingRequirementsForm } from "@pokemmo/projects/ProjectPricingRequirementsForm";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { boxShadowCard, colorPrimary } from "@pokemmo/styles/variables";
import { relativeTime } from "@pokemmo/utils";
import React from "react";
import { useHistory, useParams } from "react-router-dom";

interface IProps {}

export function ProjectView(props: IProps) {
    const { updateProject } = useProjectActions();
    const { projectID } = useParams<{ projectID: string }>();
    const project = useProject(projectID);
    const projectPokemon = useProjectPokemon(projectID);

    if (!project || !projectPokemon) {
        return <>Not Found</>;
    }

    return (
        <div>
            <Breadcrumbs
                crumbs={[
                    {
                        name: "Projects",
                        href: "/projects",
                    },
                    {
                        name: project.projectName,
                        href: `/projects/${project.projectID}`,
                    },
                ]}
            />
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
            <CalculateBar project={project} />
            {/* <ProjectShoppingList project={project} /> */}
        </div>
    );
}

function CalculateBar(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const { updateProject } = useProjectActions();
    const history = useHistory();
    const pokemon = usePokemon(project.targetPokemonID);
    const pageSize = usePageContentSize();

    if (!pokemon) {
        return null;
    }
    const { breederStubs } = project;
    const hasBeenCalculated = breederStubs
        ? Object.keys(breederStubs).length > 0
        : false;

    const calculateBreeders = () => {
        // Mix in project costs.
        const breeders = PokemonBuilder.from(pokemon)
            .ivs(project.ivPricing)
            .calculateBreeders({
                allowedIdentifiers: project.altBreederIdentifiers,
            });
        const stubs: Record<string, IPokemonBreederStub[]> = {};
        breeders.forEach(breeder => {
            if (stubs[breeder.stubHash]) {
                stubs[breeder.stubHash].push(breeder);
            } else {
                stubs[breeder.stubHash] = [breeder];
            }
        });

        updateProject({ projectID, breederStubs: stubs });
        history.push(`/projects/${project.projectID}/guide`);
    };

    return (
        <>
            <div css={{ height: 32 }}></div>
            <div
                css={{
                    height: 66,
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    left: pageSize.left,
                    background: "#fff",
                    boxShadow: boxShadowCard,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: pageContainerPadding,
                    paddingTop: 0,
                    paddingBottom: 0,
                }}
            >
                <h3 css={{ marginBottom: 0 }}>Breeding Guide</h3>
                <div>
                    {hasBeenCalculated && (
                        <FormButton
                            css={{ marginRight: 18 }}
                            buttonType={ButtonType.STANDARD}
                            onClick={() => {
                                calculateBreeders();
                            }}
                        >
                            Recalculate
                        </FormButton>
                    )}
                    <FormButton
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => {
                            if (hasBeenCalculated) {
                                history.push(
                                    `/projects/${project.projectID}/guide`,
                                );
                                return;
                            }
                            calculateBreeders();
                        }}
                    >
                        {hasBeenCalculated ? "View" : "Calculate"}
                    </FormButton>
                </div>
            </div>
        </>
    );
}
