/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon, PokedexMon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormInputField } from "@pokemmo/form/FormInput";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import {
    FormToggleButton,
    IToggleButtonOption,
} from "@pokemmo/form/FormToggleButton";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { Modal } from "@pokemmo/layout/Modal";
import { nameForStat } from "@pokemmo/pokemon/IVUtils";
import { NatureSelect } from "@pokemmo/pokemon/NatureSelect";
import { PokemonBuilder } from "@pokemmo/pokemon/PokemonBuilder";
import { usePokemonActions } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonSelect } from "@pokemmo/pokemon/PokemonSelect";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import {
    Gender,
    IPokemon,
    IVRequirements,
    OwnershipStatus,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { CssType } from "@pokemmo/styles/variables";
import { uppercaseFirst } from "@pokemmo/utils";
import { Dialog } from "@reach/dialog";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

interface IProps extends React.ComponentProps<typeof Dialog> {
    isProject?: boolean;
    projectID?: string;
    afterSubmit?: (pokemon: IPokemon) => void;
    requirements?: IPokemonFormRequirements;
}

export interface IPokemonForm {
    pokemon: string | null;
    gender: Gender;
    nature: string | null;
    ownershipStatus: OwnershipStatus;
    cost: number | null;
    stats: IVRequirements;
}

export interface IPokemonFormRequirements {
    allowedIdentifiers?: string[];
    gender?: Gender;
    nature?: string;
    requiredIVs?: Partial<IVRequirements>;
}

const INITIAL_FORM: IPokemonForm = {
    pokemon: null,
    gender: Gender.MALE,
    nature: null,
    ownershipStatus: OwnershipStatus.CAUGHT,
    cost: null,
    stats: {
        [Stat.HP]: { value: 0, prices: {} },
        [Stat.ATTACK]: { value: 0, prices: {} },
        [Stat.DEFENSE]: { value: 0, prices: {} },
        [Stat.SPECIAL_ATTACK]: { value: 0, prices: {} },
        [Stat.SPECIAL_DEFENSE]: { value: 0, prices: {} },
        [Stat.SPEED]: { value: 0, prices: {} },
    },
};

const ownershipOptions: IToggleButtonOption[] = Object.values(
    OwnershipStatus,
).map(status => {
    return {
        label: uppercaseFirst(status),
        value: status,
    };
});

export function PokemonForm(_props: IProps) {
    const { addPokemon } = usePokemonActions();
    const {
        afterSubmit,
        isProject,
        requirements,
        projectID,
        ...props
    } = _props;

    const form = useFormik({
        initialValues: INITIAL_FORM,
        validateOnMount: false,
        validationSchema: Yup.object().shape({
            pokemon: Yup.mixed().required("Required"),
        }),
        onSubmit: (values, { setFieldError }) => {
            if (!values.pokemon) {
                return;
            }
            const builder = PokemonBuilder.create(values.pokemon)
                .ivs(values.stats)
                .gender(values.gender)
                .nature(values.nature)
                .ownershipStatus(values.ownershipStatus, values.cost ?? 0);

            if (projectID) {
                builder.projectIDs([projectID]);
            }

            const pokemon = builder.result();

            addPokemon([pokemon]);
            props.onDismiss?.();
            afterSubmit?.(pokemon);
        },
    });

    const title = isProject ? "Start Project" : "Add Pokemon";
    const dexMon = getPokemon(form.values.pokemon);

    let forceGender: Gender | undefined;
    if (dexMon?.percentageMale === 100) {
        forceGender = Gender.MALE;
    } else if (dexMon?.percentageMale === 0) {
        forceGender = Gender.FEMALE;
    }

    const content = (
        <>
            <FormHeading
                title="Pokemon"
                description={
                    isProject
                        ? "Add information on your desired project pokemon."
                        : "Add an existing pokemon that you’ve either bought, bred, or caught."
                }
            />
            <FormRow
                itemStyles={{
                    minWidth: 0,
                    flexGrow: 1,
                }}
            >
                <FormLabel label="Pokemon Name">
                    <PokemonSelect
                        allowedIdentifiers={requirements?.allowedIdentifiers}
                        fieldName="pokemon"
                        forceGender={requirements?.gender}
                    />
                </FormLabel>
                <FormLabel label="Nature">
                    <NatureSelect
                        forceValue={requirements?.nature}
                        fieldName="nature"
                    />
                </FormLabel>
                <FormLabel label="Gender" css={{ flex: "initial" }}>
                    <FormToggleButton
                        options={[
                            { label: "Male", value: Gender.MALE },
                            { label: "Female", value: Gender.FEMALE },
                        ]}
                        fieldName="gender"
                        forceValue={requirements?.gender ?? forceGender}
                    />
                </FormLabel>
            </FormRow>
            {dexMon && <PokemonFormPreview dexMon={dexMon} />}
            <FormHeading
                title="Status & Price"
                description="Input price and current status of your pokemon"
            />
            <FormRow
                firstItemStyles={{
                    flex: "initial",
                    minWidth: 0,
                }}
            >
                <FormLabel label="Status">
                    {/* Projects get forced into the project status. */}
                    <FormToggleButton
                        forceValue={
                            isProject ||
                            form.values.ownershipStatus ===
                                OwnershipStatus.PROJECT
                                ? OwnershipStatus.PROJECT
                                : undefined
                        }
                        options={ownershipOptions.filter(option => {
                            if (
                                !isProject &&
                                form.values.ownershipStatus !==
                                    OwnershipStatus.PROJECT &&
                                option.value === OwnershipStatus.PROJECT
                            ) {
                                return false;
                            } else {
                                return true;
                            }
                        })}
                        fieldName="ownershipStatus"
                    />
                </FormLabel>
                {form.values.ownershipStatus === OwnershipStatus.BOUGHT && (
                    <FormLabel label="Cost">
                        <FormInputField
                            beforeNode="¥"
                            type="number"
                            fieldName="cost"
                            placeholder="10,000"
                        />
                    </FormLabel>
                )}
            </FormRow>
            <FormHeading
                title="Stats"
                description="Add the stats for your Pokemon."
            />
            <FormRow
                itemStyles={{
                    flex: 1,
                    minWidth: "29%",
                }}
            >
                {Object.values(Stat).map(stat => {
                    const forcedStatValue =
                        requirements?.requiredIVs?.[stat]?.value;
                    return (
                        <FormLabel label={nameForStat(stat)} key={stat}>
                            <FormInputField
                                forceValue={forcedStatValue}
                                min={0}
                                max={31}
                                type="number"
                                fieldName={`stats.${stat}.value`}
                                placeholder="0"
                            />
                        </FormLabel>
                    );
                })}
            </FormRow>
        </>
    );

    return (
        <FormikProvider value={form}>
            <Modal
                {...props}
                InnerWrap={Form}
                title={title}
                body={content}
                footer={
                    <>
                        <FormButton
                            onClick={() => {
                                props.onDismiss?.();
                            }}
                        >
                            Close
                        </FormButton>
                        <FormButton buttonType={ButtonType.SUBMIT}>
                            Save
                        </FormButton>
                    </>
                }
            />
        </FormikProvider>
    );
}

const previewCardCSS: CssType = {
    minWidth: 160,
    marginRight: 40,
    "&:last-child": {
        marginRight: 0,
    },
};

function PokemonFormPreview(props: { dexMon: PokedexMon }) {
    return (
        <div
            css={{
                marginBottom: 32,
                display: "flex",
                alignItems: "center",
            }}
        >
            <PokemonSprite dexMon={props.dexMon} height={120} width={120} />
            <div
                css={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 40px",
                }}
            >
                <DecoratedCard css={previewCardCSS}>
                    <LabelAndValue label="Egg Group 1" vertical>
                        {props.dexMon.eggGroup1}
                    </LabelAndValue>
                </DecoratedCard>
                <DecoratedCard css={previewCardCSS}>
                    <LabelAndValue label="Egg Group 1" vertical>
                        {props.dexMon.eggGroup2 ?? "(N/A)"}
                    </LabelAndValue>
                </DecoratedCard>
                <DecoratedCard css={previewCardCSS}>
                    <LabelAndValue label="Percentage Male" vertical>
                        {props.dexMon.percentageMale}%
                    </LabelAndValue>
                </DecoratedCard>
            </div>
        </div>
    );
}
