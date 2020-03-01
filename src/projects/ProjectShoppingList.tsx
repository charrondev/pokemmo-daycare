/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { IProject } from "@pokemmo/projects/projectsSlice";
import React from "react";

export function ProjectShoppingList(props: { project: IProject }) {
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
