/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInput } from "@pokemmo/form/FormInput";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import { Gender, IVRequirements, Stat } from "@pokemmo/pokemon/PokemonTypes";
import { StatView } from "@pokemmo/projects/IVView";
import { useProjectActions } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { makeSingleBorder } from "@pokemmo/styles/variables";
import React from "react";

export function ProjectPricingRequirementsForm(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const { updateProject } = useProjectActions();
    const onAveragePriceChange = (averagePricing: number) => {
        updateProject({ projectID, averagePricing });
    };
    const averagePrice = project.averagePricing;
    const ivPricing = project.ivPricing;
    const onIVPricingChange = (ivPricing: IVRequirements) => {
        updateProject({ projectID, ivPricing });
    };

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
