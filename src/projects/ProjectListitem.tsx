/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { Card } from "@pokemmo/styles/Card";
import { fontSizeLarge } from "@pokemmo/styles/variables";
import React from "react";

interface IProps {
    project: IProject;
}

export function ProjectListItem(props: IProps) {
    // let pokemon = usePokemon(props.project.pokemonID);

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
