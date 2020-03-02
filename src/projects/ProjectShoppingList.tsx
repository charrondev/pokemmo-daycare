/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { IPokemonBreederStub } from "@pokemmo/pokemon/PokemonTypes";
import { useProject } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import React from "react";

export function ProjectShoppingList(props: { project: IProject }) {
    // const { project } = props;
    // const { projectID, breederStubs, breederPokemonIDs } = project;

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

function useBreederStubsByGrouping(
    projectID: string,
): {
    owned: Record<string, IPokemonBreederStub>;
    required: Record<string, IPokemonBreederStub>;
} {
    const project = useProject(projectID);
    const result = {
        owned: {},
        required: {},
    };

    if (!project) {
        return result;
    }

    // for (const breederStub of project.breederStubs) {
    //     const id = PokemonBuilder.ivRequirementsAsString(breederStub.ivs) + "-" + breederStub.gender + "-" + breederStub.nature;
    // }

    return result;
}
