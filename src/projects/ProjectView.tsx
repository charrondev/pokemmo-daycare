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
import { Gender, IVRequirements, Stat } from "@pokemmo/pokemon/PokemonTypes";
import { StatView } from "@pokemmo/projects/IVView";
import { ProjectAlternativeBreederForm } from "@pokemmo/projects/ProjectAlternativeBreederForm";
import { useProjectActions } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { colorPrimary, makeSingleBorder } from "@pokemmo/styles/variables";
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
            <PricingRequirementsForm
                onAveragePriceChange={averagePricing => {
                    updateProject({ projectID, averagePricing });
                }}
                averagePrice={project.averagePricing}
                ivPricing={project.ivPricing}
                onIVPricingChange={ivPricing => {
                    updateProject({ projectID, ivPricing });
                }}
            />
            <ProjectAlternativeBreederForm project={project} />
            <ProjectShoppingList project={project} />
        </div>
    );
}

function PricingRequirementsForm(props: {
    averagePrice: number;
    onAveragePriceChange: (averagePrice: number) => void;
    ivPricing: IVRequirements;
    onIVPricingChange: (value: IVRequirements) => void;
}) {
    const {
        averagePrice,
        onAveragePriceChange,
        ivPricing,
        onIVPricingChange,
    } = props;

    return (
        <>
            <FormHeading
                title="Pricing Information"
                description="Add some pricing information from GTL in order to generate a more accurate price estimate."
            />
            <FormRow>
                <FormLabel
                    css={{ maxWidth: 400 }}
                    label="Average Price (across all stats)"
                >
                    <FormInput
                        value={averagePrice}
                        onChange={onAveragePriceChange}
                    />
                </FormLabel>
            </FormRow>
            <FormRow itemStyles={{ flexGrow: 1 }}>
                <table
                    css={{
                        "& th": {
                            borderBottom: makeSingleBorder(1),
                        },
                        width: "100%",
                        "& td, & th": {
                            textAlign: "left",
                            padding: "6px 12px",
                        },
                        "& td:first-of-type, & th:first-of-type": {
                            fontWeight: "bold",
                            paddingLeft: 0,
                        },
                        "& td:last-of-type, & th:last-of-type": {
                            fontWeight: "bold",
                            paddingRight: 0,
                        },
                    }}
                >
                    <thead>
                        <th>Stat</th>
                        <th>Male Price (Avg.)</th>
                        <th>Female Price (Avg.)</th>
                    </thead>
                    <tbody>
                        {Object.entries(ivPricing).map(([stat, data]) => {
                            if (data.value === 0) {
                                return <React.Fragment key={stat} />;
                            }

                            return (
                                <tr key={stat}>
                                    <td>
                                        <StatView
                                            stat={stat as Stat}
                                            points={data.value}
                                        />
                                    </td>
                                    <td>
                                        <FormInput
                                            type="number"
                                            beforeNode="¥"
                                            value={
                                                data.prices.male ?? averagePrice
                                            }
                                            onChange={malePricing => {
                                                onIVPricingChange({
                                                    ...ivPricing,
                                                    [stat]: {
                                                        ...data,
                                                        prices: {
                                                            ...data.prices,
                                                            [Gender.MALE]: malePricing,
                                                        },
                                                    },
                                                });
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <FormInput
                                            type="number"
                                            beforeNode="¥"
                                            value={
                                                data.prices.female ??
                                                averagePrice
                                            }
                                            onChange={femalePricing => {
                                                onIVPricingChange({
                                                    ...ivPricing,
                                                    [stat]: {
                                                        ...data,
                                                        prices: {
                                                            ...data.prices,
                                                            [Gender.FEMALE]: femalePricing,
                                                        },
                                                    },
                                                });
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </FormRow>
        </>
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
