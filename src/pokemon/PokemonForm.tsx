/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import formik from "formik";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";

interface IProps extends React.ComponentProps<typeof Dialog> {
    pokemonID?: string;
}

export function PokemonForm(props: IProps) {
    const title = props.pokemonID == null ? "Create Pokemon" : "Edit Pokemon";

    return (
        <Dialog
            {...props}
            aria-label={title}
            css={{
                borderRadius: 12,
            }}
        >
            <h2>{title}</h2>
            <button type="button"> Close</button>
            Hello Pokemon Form
        </Dialog>
    );
}
