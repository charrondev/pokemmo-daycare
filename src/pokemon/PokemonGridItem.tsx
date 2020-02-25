/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { PokemonType } from "@pokemmo/pokemon/PokemonFactory";
import { getPokemon } from "@pokemmo/data/pokedex";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { IVView } from "@pokemmo/projects/IVView";
import { Gender } from "@pokemmo/pokemon/IVUtils";
import { uppercaseFirst } from "@pokemmo/utils";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    pokemon: PokemonType;
}

export function PokemonGridItem(_props: IProps) {
    const { pokemon, ...props } = _props;

    const dexMon = getPokemon(pokemon.name);

    let hasStats = false;
    Object.values(pokemon.ivRequirements).forEach(stat => {
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
                        {pokemon.nature.name}
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
                        ivRequirements={pokemon.ivRequirements}
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
