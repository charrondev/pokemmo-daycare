/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { PageLayout } from "@pokemmo/layout/PageLayout";
import { useAllPokemon } from "@pokemmo/pokemon/pokemonSlice";
import { PokemonGridItem } from "@pokemmo/pokemon/PokemonGridItem";

interface IProps {}

const gridItemPadding = 18;

export function PokemonPage() {
    const pokemon = useSortedPokemon();
    return (
        <PageLayout
            content={
                <div>
                    <div
                        css={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            marginLeft: -gridItemPadding,
                            maxWidth: `calc(100% + ${gridItemPadding * 2}px)`,
                        }}
                    >
                        {Object.values(pokemon).map(pokemon => {
                            return (
                                <PokemonGridItem
                                    css={{ margin: gridItemPadding }}
                                    pokemon={pokemon}
                                    key={pokemon.uuid}
                                />
                            );
                        })}
                    </div>
                </div>
            }
            subNav={<div>Hello subnav</div>}
        />
    );
}

function useSortedPokemon() {
    const allPokemon = useAllPokemon();
    return allPokemon;
}
