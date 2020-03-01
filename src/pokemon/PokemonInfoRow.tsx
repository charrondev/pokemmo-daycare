/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { FormRow } from "@pokemmo/form/FormRow";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { DecoratedCard } from "@pokemmo/styles/Card";
import React from "react";

interface IProps {
    pokemon: IPokemon;
}

export function PokemonInfoRow(props: IProps) {
    const { pokemon } = props;
    const dexMon = getPokemon(pokemon.identifier);
    if (!dexMon) {
        return null;
    }

    return (
        <FormRow
            css={{ alignItems: "center " }}
            itemStyles={{
                minWidth: 140,
                flex: "auto",
                flexGrow: 0,
                marginRight: 36,
            }}
        >
            <PokemonSprite
                dexMon={dexMon}
                height={120}
                width={150}
                css={{ flexGrow: 0 }}
            />
            <DecoratedCard>
                <LabelAndValue vertical label="Name">
                    {dexMon.displayName}
                </LabelAndValue>
            </DecoratedCard>
            <DecoratedCard>
                <LabelAndValue vertical label="Nature">
                    {pokemon?.nature}
                </LabelAndValue>
            </DecoratedCard>
            <DecoratedCard>
                <LabelAndValue vertical label="Egg Group 1">
                    {dexMon.eggGroup1}
                </LabelAndValue>
            </DecoratedCard>
            {dexMon.eggGroup2 && (
                <DecoratedCard>
                    <LabelAndValue vertical label="Egg Group 1">
                        {dexMon.eggGroup2}
                    </LabelAndValue>
                </DecoratedCard>
            )}
        </FormRow>
    );
}
