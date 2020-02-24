/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import {
    loadPokedexOptions,
    makeSpriteUrl,
    pokedexOptions,
} from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormSelect } from "@pokemmo/form/FormSelect";
import { Dialog } from "@reach/dialog";
import React from "react";
import { FormatOptionLabelMeta, OptionTypeBase } from "react-select";
import { PokemonSelect } from "@pokemmo/pokemon/PokemonSelect";

interface IProps extends React.ComponentProps<typeof Dialog> {
    pokemonID?: string;
    asModal?: boolean;
}

export function PokemonForm(_props: IProps) {
    const { asModal, pokemonID, ...props } = _props;
    const title = pokemonID == null ? "Create Pokemon" : "Edit Pokemon";

    const content = (
        <form>
            <FormHeading
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
            <PokemonSelect />
        </form>
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
