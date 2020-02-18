/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import Button, { ButtonGroup } from "@atlaskit/button";
import { Checkbox } from "@atlaskit/checkbox";
import Form, {
    CheckboxField,
    Field,
    Fieldset,
    FormHeader,
    FormSection,
    FormFooter,
} from "@atlaskit/form";
import Select, {
    AsyncSelect,
    FormatOptionLabelMeta,
    OptionsType,
    OptionType,
    ValueType,
} from "@atlaskit/select";
import TextField from "@atlaskit/textfield";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Gender, IVRequirements, Nature, Stat } from "../pokemon/IVUtils";
import * as natures from "../pokemon/natures";
import { PokemonFactory } from "../pokemon/PokemonFactory";
import {
    loadPokedexOptions,
    PokeDexMonOptionType,
    pokedexOptions,
    makeSpriteUrl,
    PokedexMon,
    pokemonForEggGroup,
    getPokemon,
    mapDexMonToItem,
} from "../data/pokedex";
import { setValue } from "./utils";
import { NatureView } from "./NatureView";
import { PokemonSpriteAndInfo } from "./PokemonSpriteAndInfo";
import { PokemonName } from "./PokemonName";
import { ProjectFormHeader } from "./ProjectFormHeader";

interface NatureOptionType extends OptionType {
    nature: Nature;
}

export interface ProjectFormValues {
    pokemon: PokeDexMonOptionType | null;
    nature: NatureOptionType | null;
    averagePrice?: number;
    activeIVs: Stat[];
    ivRequirements: IVRequirements;
    gender: Gender;
    projectName: string;
    allowEvolvedPokemon?: boolean;
    allowedAlternativeIdentifiers: string[];
}

function mapData(data: any): ProjectFormValues {
    const result = {
        pokemon: null,
        nature: null,
        averagePrice: undefined,
        activeIVs: [] as any[],
        ivRequirements: {} as IVRequirements,
        gender: Gender.MALE,
        projectName: "",
        allowedAlternativeIdentifiers: [],
    };
    for (const [key, value] of Object.entries(data)) {
        setValue(result, key, value, "/");
    }

    const finalRequirements: IVRequirements = {};
    for (const [stat, statInfo] of Object.entries(result.ivRequirements)) {
        if (result.activeIVs.includes(stat) && stat in result.ivRequirements) {
            statInfo!.value = statInfo?.value ?? 31;
            finalRequirements[stat as Stat] = statInfo;
        }
    }
    result.ivRequirements = finalRequirements;
    return result as ProjectFormValues;
}

const natureOptions: OptionsType<NatureOptionType> = Object.values(natures).map(
    nature => {
        return {
            label: nature.name,
            value: nature.name,
            nature,
        };
    },
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

const RowItem = styled.div<{ alignRight?: boolean }>`
    min-width: 400px;
    padding: 12px;
    flex: 1;
    ${props =>
        props.alignRight
            ? `
        display: flex;
        justifyContent: flex-end;
    `
            : ""}
`;

export function ProjectForm(props: {
    onSubmit?: (value: ProjectFormValues) => void;
    initialValues?: ProjectFormValues;
}) {
    const { initialValues } = props;
    const [allowEvolvedPokemon, setAllowEvolvedPokemon] = useState(
        props.initialValues?.allowEvolvedPokemon ?? true,
    );

    const [
        allowedAlternativeIdentifiers,
        setAllowedAlternativeIdentifiers,
    ] = useState<string[]>(
        props.initialValues?.allowedAlternativeIdentifiers ?? [],
    );
    const forceUpdate = useForceUpdate();
    return (
        <div>
            <Form<ProjectFormValues>
                onSubmit={(values, form) => {
                    const result = mapData(values);
                    result.allowEvolvedPokemon = allowEvolvedPokemon;
                    result.allowedAlternativeIdentifiers = allowedAlternativeIdentifiers;
                    props.onSubmit?.(result);
                }}
            >
                {({ formProps, getValues }) => {
                    const pokemon = getValues().pokemon?.pokedexMon;
                    return (
                        <form {...formProps}>
                            <FormSection>
                                <RowWrapper>
                                    <RowItem>
                                        <FormHeader
                                            title="What are your breeding?"
                                            description="Choose your pokemon and requirements."
                                        />
                                    </RowItem>
                                    <RowItem alignRight>
                                        {pokemon && (
                                            <PokemonSpriteAndInfo
                                                pokemonIdentifier={
                                                    pokemon.identifier
                                                }
                                            />
                                        )}
                                    </RowItem>
                                </RowWrapper>

                                <RowWrapper>
                                    <RowItem>
                                        <Field<ValueType<PokeDexMonOptionType>>
                                            name="pokemon"
                                            label="Pokemon Name"
                                            isRequired
                                            defaultValue={
                                                initialValues?.pokemon ?? null
                                            }
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
                                                            30,
                                                        )}
                                                        loadOptions={
                                                            loadPokedexOptions
                                                        }
                                                        placeholder="Pokemon Name"
                                                        onChange={arg => {
                                                            fieldProps.onChange(
                                                                arg,
                                                            );
                                                            forceUpdate();
                                                        }}
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </RowItem>
                                    <RowItem>
                                        <Field
                                            name="projectName"
                                            label="Project Name"
                                            defaultValue={
                                                initialValues?.projectName ?? ""
                                            }
                                        >
                                            {({ fieldProps }) => (
                                                <TextField
                                                    {...fieldProps}
                                                    placeholder={"(Untitled)"}
                                                />
                                            )}
                                        </Field>
                                    </RowItem>
                                </RowWrapper>
                            </FormSection>
                            <AlternativeBreedersInput
                                pokemon={pokemon}
                                value={allowedAlternativeIdentifiers}
                                onChange={setAllowedAlternativeIdentifiers}
                                allowEvolved={allowEvolvedPokemon}
                                onAllowEvolvedChange={setAllowEvolvedPokemon}
                            />
                            <FormSection>
                                <FormHeader
                                    title="Required Stats"
                                    description="Choose your required IVs and nature"
                                />
                                <NatureAndIVs
                                    initialValues={initialValues}
                                    onChange={forceUpdate}
                                />
                            </FormSection>
                            <IVRequirementsForm
                                initialValues={initialValues}
                                averagePrice={
                                    mapData(getValues()).averagePrice ||
                                    PokemonFactory.AVERAGE_UNDEFINED_PRICE
                                }
                                activeIVs={mapData(getValues()).activeIVs}
                            ></IVRequirementsForm>
                            <FormFooter>
                                <ButtonGroup>
                                    <Button appearance="primary" type="submit">
                                        {pokemon ? "Recalculate" : "Calculate"}
                                    </Button>
                                </ButtonGroup>
                            </FormFooter>
                        </form>
                    );
                }}
            </Form>
        </div>
    );
}

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
    width: 100%;
    flex-wrap: wrap;
`;

const CenterVertical = styled.div`
    display: flex;
    align-items: center;
`;

const CheckWrapper = styled.div<{ isHidden?: boolean }>`
    margin-right: 12px;
    min-width: 120px;
    flex: 1;
    display: ${props => (props.isHidden ? "none" : "block")};
`;

function AlternativeBreedersInput(props: {
    pokemon?: PokedexMon;
    value: string[];
    onChange: (newValues: string[]) => void;
    allowEvolved: boolean;
    onAllowEvolvedChange: (newValue: boolean) => void;
}) {
    const {
        pokemon,
        allowEvolved,
        onAllowEvolvedChange,
        value,
        onChange,
    } = props;

    if (!pokemon) {
        return null;
    }

    const othersInEggGroup = pokemonForEggGroup(
        pokemon.eggGroup1,
        pokemon.eggGroup2,
        allowEvolved,
    );

    return (
        <FormSection>
            <FormHeader
                title="Alternative Breeders"
                description="The following pokemon may be used as alternatives in the breeding process. Remove any that you don't want to allow."
            />
            <ProjectFormHeader
                right={
                    <Button
                        onClick={() => {
                            onChange([]);
                        }}
                    >
                        Clear Alternatives
                    </Button>
                }
            >
                <CenterVertical>
                    <Checkbox
                        onChange={event => {
                            onAllowEvolvedChange(event.target.checked);
                        }}
                        isChecked={allowEvolved}
                        label="Allow Evolved Pokemon"
                    />
                </CenterVertical>
                <Select<PokeDexMonOptionType>
                    value={null}
                    formatOptionLabel={formatPokemonLabel}
                    isClearable
                    options={othersInEggGroup
                        .filter(mon => {
                            return (
                                !value.includes(mon.identifier) &&
                                mon.identifier !== pokemon.identifier
                            );
                        })
                        .map(mapDexMonToItem)}
                    placeholder="Add Alternative"
                    onChange={arg => {
                        if (arg && "pokedexMon" in arg) {
                            onChange([...value, arg.pokedexMon.identifier]);
                        }
                    }}
                />
            </ProjectFormHeader>
            <RowWrapper>
                <CheckGroupWrapper>
                    <Fieldset legend="Allowed Alternative Pokemon">
                        <CheckGroupRow>
                            {value.map(otherMonID => {
                                const otherMon = getPokemon(otherMonID)!;
                                return (
                                    <CheckWrapper key={otherMon.identifier}>
                                        <Checkbox
                                            isChecked={true}
                                            onChange={() => {
                                                onChange(
                                                    value.filter(
                                                        id => id !== otherMonID,
                                                    ),
                                                );
                                            }}
                                            label={
                                                <PokemonName
                                                    name={otherMon.identifier}
                                                    withSprite
                                                />
                                            }
                                        />
                                    </CheckWrapper>
                                );
                            })}
                        </CheckGroupRow>
                    </Fieldset>
                </CheckGroupWrapper>
            </RowWrapper>
        </FormSection>
    );
}

function NatureAndIVs(props: {
    onChange: () => void;
    initialValues?: ProjectFormValues;
}) {
    const stats = Object.values(Stat);
    return (
        <RowWrapper>
            <RowItem>
                <Field<ValueType<NatureOptionType>>
                    name="nature"
                    label="Nature"
                    defaultValue={props.initialValues?.nature ?? null}
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
                    defaultValue={props.initialValues?.averagePrice ?? ""}
                >
                    {({ fieldProps }) => {
                        return (
                            <TextField
                                {...fieldProps}
                                onChange={(...args) => {
                                    fieldProps.onChange(...args);
                                    props.onChange();
                                }}
                                placeholder={PokemonFactory.AVERAGE_UNDEFINED_PRICE.toString()}
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
                                        defaultIsChecked={
                                            props.initialValues?.activeIVs
                                                ? Object.values(
                                                      props.initialValues
                                                          .activeIVs,
                                                  )?.includes(stat)
                                                : false
                                        }
                                    >
                                        {({ fieldProps }) => {
                                            return (
                                                <Checkbox
                                                    {...fieldProps}
                                                    onChange={(...args) => {
                                                        fieldProps.onChange(
                                                            ...args,
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
    initialValues?: ProjectFormValues;
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
                                        defaultValue={
                                            props.initialValues
                                                ?.ivRequirements?.[stat]
                                                ?.value ?? ""
                                        }
                                        name={`ivRequirements/${stat}/value`}
                                    >
                                        {({ fieldProps }) => {
                                            return (
                                                <TextField
                                                    placeholder={"31"}
                                                    isCompact
                                                    max={31}
                                                    min={0}
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
                                        defaultValue={
                                            props.initialValues
                                                ?.ivRequirements?.[stat]
                                                ?.prices?.[Gender.MALE] ?? ""
                                        }
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
                                        defaultValue={
                                            props.initialValues
                                                ?.ivRequirements?.[stat]
                                                ?.prices?.[Gender.FEMALE] ?? ""
                                        }
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
    { context }: FormatOptionLabelMeta<OptionType>,
) => {
    if (context === "menu") {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <span>
                    <img
                        src={makeSpriteUrl(option.pokedexMon)}
                        alt={option.label + " sprite"}
                        height="24"
                        width="24"
                    />
                </span>
                <span
                    style={{
                        paddingLeft: 8,
                        paddingBottom: 0,
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
    { context }: FormatOptionLabelMeta<OptionType>,
) => {
    if (context === "menu") {
        return <NatureView nature={option.nature} />;
    }
    return option.label;
};

function eventValueToNumber(event: any): number | string {
    return event.target.value ? parseInt(event.target.value, 10) : "";
}
