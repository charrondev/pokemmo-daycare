/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { css } from "@emotion/core";
import { getPokemon } from "@pokemmo/data/pokedex";
import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { PokemonSprite } from "@pokemmo/pokemon/PokemonSprite";
import {
    Gender,
    IPokemon,
    OwnershipStatus,
} from "@pokemmo/pokemon/PokemonTypes";
import { IVView } from "@pokemmo/projects/IVView";
import { DecoratedCard } from "@pokemmo/styles/Card";
import { colorPrimary } from "@pokemmo/styles/variables";
import { numberWithCommas, uppercaseFirst } from "@pokemmo/utils";
import React from "react";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    pokemon: IPokemon;
    isSelected?: boolean;
}

const standardGridLabelStyle = css({
    flex: 1,
    minWidth: "50%",
    marginBottom: 3,
    padding: "6px 0",
});

export function PokemonGridItem(_props: IProps) {
    const { pokemon, isSelected, ...props } = _props;

    const dexMon = getPokemon(pokemon.identifier);

    let hasStats = false;
    Object.values(pokemon.ivs).forEach(stat => {
        if (stat?.value !== 0) {
            hasStats = true;
        }
    });

    return (
        <DecoratedCard
            {...props}
            css={[
                {
                    cursor: "pointer",
                    "& *": {
                        cursor: "pointer",
                    },
                },
                isSelected && {
                    boxShadow: `0 0 0 4px ${colorPrimary.string()} !important`,
                    "&.focus-visible, &:hover": {
                        boxShadow: `0 0 0 4px ${colorPrimary.string()}, 0 8px 40px 0 rgba(0, 0, 0, 0.15) !important`,
                    },
                },
            ]}
            hoverable
            role="button"
            tabIndex={0}
            decorationColor={isSelected ? colorPrimary : undefined}
        >
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
                        css={standardGridLabelStyle}
                    >
                        {pokemon.nature}
                    </LabelAndValue>
                )}
                <LabelAndValue
                    label="Gender"
                    inline
                    css={standardGridLabelStyle}
                >
                    {uppercaseFirst(pokemon.gender)}
                    {pokemon.gender === Gender.MALE ? "♂" : "♀"}
                </LabelAndValue>
                {pokemon.ownershipStatus === OwnershipStatus.BOUGHT && (
                    <LabelAndValue css={standardGridLabelStyle} label="Bought">
                        ¥{numberWithCommas(pokemon.boughtPrice)}
                    </LabelAndValue>
                )}
                {hasStats ? (
                    <IVView
                        withLabel="Stats"
                        css={{
                            flex: 1,
                            minWidth: "100%",
                            marginBottom: 3,
                            marginTop: -6,
                        }}
                        ivRequirements={pokemon.ivs}
                    />
                ) : (
                    <LabelAndValue css={standardGridLabelStyle} label="Stats">
                        (N/A)
                    </LabelAndValue>
                )}
            </div>
        </DecoratedCard>
    );
}
