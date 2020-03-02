/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon, PokedexMon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormCheckBox } from "@pokemmo/form/FormCheckBox";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormGrid, FormRow } from "@pokemmo/form/FormRow";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { usePokemon } from "@pokemmo/pokemon/pokemonHooks";
import { PokemonSelect } from "@pokemmo/pokemon/PokemonSelect";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { useProjectActions } from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { colorPrimary } from "@pokemmo/styles/variables";
import { notEmpty } from "@pokemmo/utils";
import React from "react";
import IconClear from "../icons/IconClear.svg";

export function ProjectAlternativeBreederForm(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const {
        updateProject,
        addAlternative,
        removeAlternative,
        clearAlternatives,
    } = useProjectActions();

    const pokemon = usePokemon(project.targetPokemonID);
    if (!pokemon) {
        return null;
    }

    const dexMon = getPokemon(pokemon.identifier);
    if (!dexMon) {
        return null;
    }

    return (
        <>
            <FormHeading
                title="Alternative Breeding Stock"
                description="These Pokemon may be substituted while breeding."
            />
            <FormRow
                css={{
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                }}
            >
                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <FormLabel
                        label="Add Alternative"
                        css={{ maxWidth: 400, flex: 1, marginRight: 24 }}
                    >
                        <PokemonSelect
                            eggGroups={[
                                dexMon.eggGroup1,
                                dexMon.eggGroup2,
                            ].filter(notEmpty)}
                            excludeIdentifiers={project.altBreederIdentifiers}
                            placeholder="Find Pokemon"
                            onChange={alternativeIdentifier => {
                                addAlternative({
                                    projectID,
                                    alternativeIdentifier: alternativeIdentifier as string,
                                });
                            }}
                            value={null}
                            allowEvolvedPokemon={
                                project.allowEvolvedAltBreeders
                            }
                        />
                    </FormLabel>
                    <FormLabel label="" css={{ paddingTop: 14 }}>
                        <FormCheckBox
                            label="Show Evolved Pokemon"
                            checked={project.allowEvolvedAltBreeders}
                            onChange={allowEvolvedAltBreeders => {
                                updateProject({
                                    allowEvolvedAltBreeders,
                                    projectID,
                                });
                            }}
                        />
                    </FormLabel>
                </div>
                <FormButton
                    css={{ marginBottom: 6, flex: "0 1 auto" }}
                    onClick={() => {
                        clearAlternatives({ projectID });
                    }}
                    disabled={project.altBreederIdentifiers.length === 0}
                >
                    Clear Alternatives
                </FormButton>
            </FormRow>
            {project.altBreederIdentifiers.length > 0 && (
                <FormGrid
                    itemStyles={
                        {
                            // minWidth: 250,
                            // maxWidth: 350,
                            // flex: 1,
                            // flexGrow: 1,
                        }
                    }
                >
                    {project.altBreederIdentifiers.map(
                        (alternativeIdentifier, i) => {
                            const dexMon = getPokemon(alternativeIdentifier);
                            if (!dexMon) {
                                return <React.Fragment key={i} />;
                            }

                            return (
                                <AltBreederCard
                                    dexMon={dexMon}
                                    key={i}
                                    onDelete={() => {
                                        removeAlternative({
                                            projectID,
                                            alternativeIdentifier,
                                        });
                                    }}
                                />
                            );
                        },
                    )}
                </FormGrid>
            )}
        </>
    );
}

function AltBreederCard(props: {
    dexMon: PokedexMon;
    className?: string;
    onDelete?: () => void;
}) {
    const { className, dexMon, onDelete } = props;
    return (
        <DecoratedCard
            className={className}
            decorationColor={colorPrimary}
            css={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <PokemonSprite
                dexMon={dexMon}
                css={{ marginRight: 18 }}
                height={36}
                width={36}
            />
            <LabelAndValue
                vertical
                label={dexMon.displayName}
                css={{ flex: 1 }}
            >
                Percentage Male: {dexMon.percentageMale}%
            </LabelAndValue>
            <FormButton
                buttonType={ButtonType.ICON}
                onClick={onDelete}
                title="Remove Pokemon"
            >
                <IconClear
                    css={{
                        height: 14,
                        width: 14,
                    }}
                />
            </FormButton>
        </DecoratedCard>
    );
}
