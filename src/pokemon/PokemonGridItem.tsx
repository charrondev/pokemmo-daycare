/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { getPokemon } from "@pokemmo/data/pokedex";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { IVView } from "@pokemmo/projects/IVView";
import { uppercaseFirst } from "@pokemmo/utils";
import { IPokemon, Gender } from "@pokemmo/pokemon/PokemonTypes";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    pokemon: IPokemon;
}

export function PokemonGridItem(_props: IProps) {
    const { pokemon, ...props } = _props;

    const dexMon = getPokemon(pokemon.identifier);

    let hasStats = false;
    Object.values(pokemon.ivs).forEach(stat => {
        if (stat?.value !== 0) {
            hasStats = true;
        }
    });

    return (
        <DecoratedCard {...props}>
            <h4
                css={{
                    marginBottom: 9,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <PokemonSprite dexMon={dexMon} />
                <span css={{ marginLeft: 12 }}>{dexMon?.displayName}</span>
            </h4>
            <div css={{ display: "flex", flexWrap: "wrap" }}>
                {pokemon.nature && (
                    <LabelAndValue
                        label="Nature"
                        inline
                        css={{
                            flex: 1,
                            minWidth: "50%",
                            marginBottom: 3,
                            padding: "6px 0",
                        }}
                    >
                        {pokemon.nature}
                    </LabelAndValue>
                )}
                <LabelAndValue
                    label="Gender"
                    inline
                    css={{
                        flex: 1,
                        minWidth: "50%",
                        marginBottom: 3,
                        padding: "6px 0",
                    }}
                >
                    {uppercaseFirst(pokemon.gender)}
                    {pokemon.gender === Gender.MALE ? "♂" : "♀"}
                </LabelAndValue>
                {hasStats ? (
                    <IVView
                        withLabel="Stats"
                        css={{
                            flex: 1,
                            minWidth: "50%",
                            marginBottom: 3,
                            marginTop: -6,
                        }}
                        ivRequirements={pokemon.ivs}
                    />
                ) : (
                    <LabelAndValue
                        css={{
                            flex: 1,
                            minWidth: "50%",
                            marginBottom: 3,
                            padding: "6px 0",
                        }}
                        label="Stats"
                    >
                        (N/A)
                    </LabelAndValue>
                )}
            </div>
        </DecoratedCard>
    );
}
