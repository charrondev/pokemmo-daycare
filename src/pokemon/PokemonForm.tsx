/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
import {
    NatureSelect,
    NatureSelectOptionType,
} from "@pokemmo/pokemon/NatureSelect";
import {
    PokemonSelect,
    PokemonSelectOptionType,
} from "@pokemmo/pokemon/PokemonSelect";
import { Dialog } from "@reach/dialog";
import { Form, FormikProvider, useFormik } from "formik";
import React from "react";
import { getPokemon, PokedexMon } from "@pokemmo/data/pokedex";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { LabelCard } from "@pokemmo/styles/LabelCard";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { CssType } from "@pokemmo/styles/variables";
import {
    FormToggleButton,
    IToggleButtonOption,
} from "@pokemmo/form/FormToggleButton";
import {
    PokemonStatus,
    OwnershipStatus,
} from "@pokemmo/pokemon/PokemonFactory";
import { uppercaseFirst } from "@pokemmo/utils";
import { FormInput } from "@pokemmo/form/FormInput";

interface IProps extends React.ComponentProps<typeof Dialog> {
    pokemonID?: string;
    asModal?: boolean;
}

interface IPokemonForm {
    pokemon: PokemonSelectOptionType | null;
    nature: NatureSelectOptionType | null;
    ownershipStatus: OwnershipStatus;
    cost: number | null;
}

const INITIAL_FORM: IPokemonForm = {
    pokemon: null,
    nature: null,
    ownershipStatus: OwnershipStatus.CAUGHT,
    cost: null,
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
    const form = useFormik({
        initialValues: INITIAL_FORM,
        onSubmit: values => {
            console.log(values);
        },
    });

    const { asModal, pokemonID, ...props } = _props;
    const title = pokemonID == null ? "Create Pokemon" : "Edit Pokemon";
    const dexMon = getPokemon(form.values.pokemon?.value);

    const content = (
        <FormikProvider value={form}>
            <Form>
                <FormHeading
                    tabIndex={0}
                    title={title}
                    description={
                        "Add an existing pokemon that you’ve either bought, bred, or caught."
                    }
                    actions={
                        <>
                            <FormButton>Delete</FormButton>
                            <FormButton buttonType={ButtonType.SUBMIT}>
                                Save
                            </FormButton>
                        </>
                    }
                />
                <FormHeading title="Pokemon" />
                <FormRow>
                    <FormLabel label="Pokemon Name">
                        <PokemonSelect fieldName="pokemon" />
                    </FormLabel>
                    <FormLabel label="Nature">
                        <NatureSelect fieldName="nature" />
                    </FormLabel>
                </FormRow>
                {dexMon && <PokemonFormPreview dexMon={dexMon} />}
                <FormHeading
                    title="Status & Price"
                    description="Input price and current status of your pokemon"
                />
                <FormRow>
                    <FormLabel
                        label="Status"
                        css={{ flex: "initial", minWidth: 0 }}
                    >
                        <FormToggleButton
                            options={ownershipOptions}
                            fieldName="ownershipStatus"
                        />
                    </FormLabel>
                    {form.values.ownershipStatus === OwnershipStatus.BOUGHT && (
                        <FormLabel label="Price">
                            <FormInput fieldName="ownershipStatus" />
                        </FormLabel>
                    )}
                </FormRow>
            </Form>
        </FormikProvider>
    );

    if (!asModal) {
        return content;
    }

    return (
        <Dialog
            {...props}
            aria-label={title}
            css={{
                borderRadius: 9,
                width: "100%",
                maxWidth: 1000,
            }}
        >
            {content}
        </Dialog>
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
                padding: "32px 0",
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
                <LabelCard css={previewCardCSS}>
                    <LabelAndValue label="Egg Group 1" vertical>
                        {props.dexMon.eggGroup1}
                    </LabelAndValue>
                </LabelCard>
                <LabelCard css={previewCardCSS}>
                    <LabelAndValue label="Egg Group 1" vertical>
                        {props.dexMon.eggGroup2 ?? "(N/A)"}
                    </LabelAndValue>
                </LabelCard>
                <LabelCard css={previewCardCSS}>
                    <LabelAndValue label="Percentage Male" vertical>
                        {props.dexMon.percentageMale}%
                    </LabelAndValue>
                </LabelCard>
            </div>
        </div>
    );
}
