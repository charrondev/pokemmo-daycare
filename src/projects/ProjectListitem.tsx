/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { usePokemon } from "@pokemmo/pokemon/pokemonSlice";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { ProjectDataType } from "@pokemmo/projects/projectsSlice";
import { Card } from "@pokemmo/styles/Card";
import { fontSizeLarge } from "@pokemmo/styles/variables";
import React from "react";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";

interface IProps {
    project: ProjectDataType;
}

export function ProjectListItem(props: IProps) {
    let pokemon = usePokemon(props.project.pokemonID);

    // if (!pokemon) {
    //     pokemon = getPokemon("charmander");
    // }
    const dexMon = getPokemon("charmander");

    return (
        <li
            css={{
                marginBottom: 16,
                "&:last-child": {
                    marginBottom: 0,
                },
            }}
        >
            <Card>
                <h3
                    css={{
                        fontSize: fontSizeLarge,
                        display: "flex",
                        alignItems: "flex-end",
                    }}
                >
                    <PokemonSprite dexMon={dexMon} css={{ marginRight: 6 }} />
                    <span>{dexMon?.displayName}</span>
                </h3>
                <LabelAndValue label="Estimated Cost">¥700,000</LabelAndValue>
                <LabelAndValue label="Nature">Hasty</LabelAndValue>
                <LabelAndValue label="Stats"> </LabelAndValue>
            </Card>
        </li>
    );
}
