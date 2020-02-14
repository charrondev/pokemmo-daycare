/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React, { useState, useCallback } from "react";
import Form, {
    FormSection,
    Field,
    FormHeader,
    CheckboxField,
    FormFooter,
    Fieldset
} from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import { Checkbox } from "@atlaskit/checkbox";
import styled from "styled-components";
import { Stat, Nature, IVRequirements, Gender } from "./calculator/IVUtils";
import Select, {
    OptionsType,
    ValueType,
    OptionType,
    FormatOptionLabelMeta,
    AsyncSelect
} from "@atlaskit/select";
import * as natures from "./calculator/natures";
import Button, { ButtonGroup } from "@atlaskit/button";
import { setValue } from "./utils";
import { Pokemon } from "./calculator/Pokemon";
import {
    pokedexOptions,
    PokeDexMonOptionType,
    loadPokedexOptions
} from "./pokedex";

interface NatureOptionType extends OptionType {
    nature: Nature;
}

interface FormValues {
    pokemon: PokeDexMonOptionType | null;
    nature: Nature | null;
    averagePrice?: number;
    activeIVs: Stat[];
    ivRequirements: IVRequirements;
    gender: Gender;
}

function mapData(data: any): FormValues {
    const result = {
        pokemon: null,
        nature: null,
        averagePrice: undefined,
        activeIVs: [],
        ivRequirements: {},
        gender: Gender.MALE
    };
    for (const [key, value] of Object.entries(data)) {
        setValue(result, key, value, "/");
    }
    result.nature = data?.nature?.nature;
    return result as FormValues;
}

const natureOptions: OptionsType<NatureOptionType> = Object.values(natures).map(
    nature => {
        return {
            label: nature.name,
            value: nature.name,
            nature
        };
    }
);

export function useForceUpdate() {
    const [, setTick] = useState(0);
    const update = useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

const RowWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-left: -12px;
    width: calc(100% + 24px);
`;

const RowItem = styled.div`
    min-width: 400px;
    padding: 12px;
    flex: 1;
`;

export function CalculatorForm(props: {
    onSubmit?: (value: FormValues) => void;
}) {
    const forceUpdate = useForceUpdate();
    return (
        <div>
            <Form<FormValues>
                onSubmit={(values, form) => {
                    const result = mapData(values);
                    console.log({ values, result });
                    props.onSubmit?.(result);
                }}
            >
                {({ formProps, getValues }) => {
                    const pokemon = getValues().pokemon?.pokedexMon;
                    return (
                        <form {...formProps}>
                            <FormSection>
                                <FormHeader
                                    title="Start a new Breed"
                                    description="Let's get started on a new Breed!"
                                />
                                <RowWrapper>
                                    <RowItem>
                                        <Field<ValueType<PokeDexMonOptionType>>
                                            name="pokemon"
                                            label="Pokemon Name"
                                            isRequired
                                        >
                                            {({ fieldProps }) => {
                                                return (
                                                    <AsyncSelect<
                                                        PokeDexMonOptionType
                                                    >
                                                        {...fieldProps}
                                                        formatOptionLabel={
                                                            formatPokemonLabel
                                                        }
                                                        isClearable
                                                        defaultOptions={pokedexOptions.slice(
                                                            0,
                                                            30
                                                        )}
                                                        loadOptions={
                                                            loadPokedexOptions
                                                        }
                                                        placeholder="Pokemon Name"
                                                        onChange={arg => {
                                                            fieldProps.onChange(
                                                                arg
                                                            );
                                                            forceUpdate();
                                                        }}
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </RowItem>
                                    <RowItem>
                                        {pokemon && (
                                            <img
                                                src={
                                                    pokemon.sprites.animated ??
                                                    pokemon.sprites.normal
                                                }
                                                alt={pokemon.name + " sprite"}
                                            />
                                        )}
                                    </RowItem>
                                </RowWrapper>
                            </FormSection>
                            <FormSection>
                                <FormHeader
                                    title="Required Stats"
                                    description="Choose your required IVs and nature"
                                />
                                <NatureAndIVs onChange={forceUpdate} />
                            </FormSection>
                            <IVRequirementsForm
                                averagePrice={
                                    mapData(getValues()).averagePrice ||
                                    Pokemon.AVERAGE_UNDEFINED_PRICE
                                }
                                activeIVs={mapData(getValues()).activeIVs}
                            ></IVRequirementsForm>
                            <FormFooter>
                                <ButtonGroup>
                                    <Button type="submit">Calculate</Button>
                                </ButtonGroup>
                            </FormFooter>
                        </form>
                    );
                }}
            </Form>
        </div>
    );
}

const StatModifierLabel = styled.span`
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 3px;
    display: inline-block;
    font-size: 0.6em;
`;

const CheckGroupWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 2;
    padding: 12px;
`;

const CheckGroupRow = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const CheckWrapper = styled.div`
    margin-right: 12px;
`;

function NatureAndIVs(props: { onChange: () => void }) {
    const stats = Object.values(Stat);
    return (
        <RowWrapper>
            <RowItem>
                <Field<ValueType<NatureOptionType>>
                    name="nature"
                    label="Nature"
                >
                    {({ fieldProps }) => {
                        return (
                            <Select<NatureOptionType>
                                {...fieldProps}
                                formatOptionLabel={formatNatureLabel}
                                options={natureOptions}
                                isClearable
                                placeholder="Doesn't Matter"
                            />
                        );
                    }}
                </Field>
            </RowItem>
            <RowItem>
                <Field
                    name="averagePrice"
                    label="Average Price"
                    transform={eventValueToNumber}
                >
                    {({ fieldProps }) => {
                        return (
                            <TextField
                                {...fieldProps}
                                onChange={(...args) => {
                                    fieldProps.onChange(...args);
                                    props.onChange();
                                }}
                                placeholder={Pokemon.AVERAGE_UNDEFINED_PRICE.toString()}
                                type="number"
                            />
                        );
                    }}
                </Field>
            </RowItem>
            <CheckGroupWrapper>
                <Fieldset legend="Required IVs">
                    <CheckGroupRow>
                        {stats.map((stat, i) => {
                            return (
                                <CheckWrapper key={stat}>
                                    <CheckboxField
                                        name={`activeIVs`}
                                        value={stat}
                                        defaultIsChecked={i === 0}
                                    >
                                        {({ fieldProps }) => {
                                            return (
                                                <Checkbox
                                                    {...fieldProps}
                                                    onChange={(...args) => {
                                                        fieldProps.onChange(
                                                            ...args
                                                        );
                                                        props.onChange();
                                                    }}
                                                    label={stat}
                                                />
                                            );
                                        }}
                                    </CheckboxField>
                                </CheckWrapper>
                            );
                        })}
                    </CheckGroupRow>
                </Fieldset>
            </CheckGroupWrapper>
        </RowWrapper>
    );
}

const TableItem = styled.td<{ isInput?: boolean }>`
    padding: 12px 8px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: ${props => (props.isInput ? "10px" : "2px")};
`;

function IVRequirementsForm(props: {
    activeIVs: Stat[];
    averagePrice: number;
}) {
    if (props.activeIVs.length === 0) {
        return null;
    }

    return (
        <FormSection
            title="IV Information"
            description="Set additional information about different IVs."
        >
            <table>
                <thead>
                    <tr>
                        <th>IV Name</th>
                        <th>IV Total</th>
                        <th>Male Price (Avg.)</th>
                        <th>Female Price (Avg.)</th>
                    </tr>
                </thead>
                <tbody>
                    {props.activeIVs.map(stat => {
                        return (
                            <tr key={stat}>
                                <td style={{ fontWeight: "bold" }}>{stat}</td>
                                <TableItem isInput>
                                    <Field
                                        transform={eventValueToNumber}
                                        name={`ivRequirements/${stat}/value`}
                                    >
                                        {({ fieldProps }) => {
                                            return (
                                                <TextField
                                                    placeholder={"31"}
                                                    isCompact
                                                    type="number"
                                                    {...fieldProps}
                                                />
                                            );
                                        }}
                                    </Field>
                                </TableItem>
                                <TableItem isInput>
                                    <Field
                                        transform={eventValueToNumber}
                                        name={`ivRequirements/${stat}/prices/${Gender.MALE}`}
                                    >
                                        {({ fieldProps }) => {
                                            return (
                                                <TextField
                                                    placeholder={props.averagePrice.toString()}
                                                    isCompact
                                                    type="number"
                                                    {...fieldProps}
                                                />
                                            );
                                        }}
                                    </Field>
                                </TableItem>
                                <TableItem isInput>
                                    <Field
                                        transform={eventValueToNumber}
                                        name={`ivRequirements/${stat}/prices/${Gender.FEMALE}`}
                                    >
                                        {({ fieldProps }) => {
                                            return (
                                                <TextField
                                                    placeholder={props.averagePrice.toString()}
                                                    isCompact
                                                    {...fieldProps}
                                                    type="number"
                                                />
                                            );
                                        }}
                                    </Field>
                                </TableItem>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </FormSection>
    );
}

const formatPokemonLabel = (
    option: PokeDexMonOptionType,
    { context }: FormatOptionLabelMeta<OptionType>
) => {
    if (context === "menu") {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}
            >
                <span>
                    <img
                        src={option.pokedexMon.sprites.normal}
                        alt={option.label + " sprite"}
                        height="24"
                        width="24"
                    />
                </span>
                <span
                    style={{
                        paddingLeft: 8,
                        paddingBottom: 0
                    }}
                >
                    {option.label}
                </span>
            </div>
        );
    }
    return option.label;
};

const formatNatureLabel = (
    option: NatureOptionType,
    { context }: FormatOptionLabelMeta<OptionType>
) => {
    if (context === "menu") {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between"
                }}
            >
                <span
                    style={{
                        paddingLeft: 8,
                        paddingBottom: 0
                    }}
                >
                    {option.label}
                </span>
                <span>
                    {option.nature.positiveStat && (
                        <StatModifierLabel>
                            +{option.nature.positiveStat}
                        </StatModifierLabel>
                    )}
                    {option.nature.negativeStat && (
                        <StatModifierLabel>
                            -{option.nature.negativeStat}
                        </StatModifierLabel>
                    )}
                </span>
            </div>
        );
    }
    return option.label;
};

function eventValueToNumber(event: any): number | string {
    return event.target.value ? parseInt(event.target.value, 10) : "";
}
