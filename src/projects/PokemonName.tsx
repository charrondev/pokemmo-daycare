/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React, { useMemo } from "react";
import { getPokemon } from "./pokedex";
import styled from "styled-components";
import { uppercaseFirst } from "./utils";

const TitleCell = styled.span`
    display: flex;
    align-items: center;
`;

export function PokemonName(props: {
    name?: string | number;
    withSprite?: boolean;
}) {
    const { name } = props;

    const pokemon = useMemo(() => {
        return name ? getPokemon(name)! : null;
    }, [name]);

    if (!pokemon) {
        return <TitleCell>(Pokemon Not Found)</TitleCell>;
    }

    return (
        <TitleCell>
            {props.withSprite && (
                <img
                    src={pokemon.sprites.normal}
                    height={24}
                    width={24}
                    alt={""}
                />
            )}
            {uppercaseFirst(pokemon.name)}
        </TitleCell>
    );
}
