/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { getPokemon, PokedexMon } from "@pokemmo/data/pokedex";
import { FormButton } from "@pokemmo/form/FormButton";
import { FormHeading } from "@pokemmo/form/FormHeading";
import { FormLabel } from "@pokemmo/form/FormLabel";
import { FormRow } from "@pokemmo/form/FormRow";
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

export function ProjectAlternativeBreederForm(props: { project: IProject }) {
    const { project } = props;
    const { projectID } = project;
    const { addAlternative, clearAlternatives } = useProjectActions();

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
                <div>
                    <FormLabel label="Add Alternative" css={{ maxWidth: 400 }}>
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
                        />
                    </FormLabel>
                </div>
                <FormButton
                    css={{ marginBottom: 6, flex: "0 1 auto" }}
                    onClick={() => {
                        clearAlternatives({ projectID });
                    }}
                >
                    Clear Alternatives
                </FormButton>
            </FormRow>
            {project.altBreederIdentifiers.length > 0 && (
                <FormRow
                    itemStyles={{
                        minWidth: 250,
                        maxWidth: 350,
                        flex: 1,
                        flexGrow: 1,
                    }}
                >
                    {project.altBreederIdentifiers.map((identifier, i) => {
                        const dexMon = getPokemon(identifier);
                        if (!dexMon) {
                            return <React.Fragment key={i} />;
                        }

                        return <AltBreederCard dexMon={dexMon} key={i} />;
                    })}
                </FormRow>
            )}
        </>
    );
}

function AltBreederCard(props: { dexMon: PokedexMon; className?: string }) {
    const { className, dexMon } = props;
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
            <LabelAndValue vertical label={dexMon.displayName}>
                Percentage Male: {dexMon.percentageMale}%
            </LabelAndValue>
        </DecoratedCard>
    );
}
