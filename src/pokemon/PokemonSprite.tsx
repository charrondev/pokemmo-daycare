/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { makeSpriteUrl, PokedexMon } from "@pokemmo/data/pokedex";
import { StyledFactory } from "@pokemmo/styles/styledUtils";
import React from "react";

const SpriteImg = StyledFactory(
    "img",
    {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition: "center, center",
        transform: "scale(1.2)",
    },
    "SpriteImage",
);

interface IProps {
    dexMon?: PokedexMon | null;
    height?: number;
    width?: number;
    className?: string;
}

export function PokemonSprite(props: IProps) {
    return (
        <div
            className={props.className}
            css={{
                height: props.height ?? 24,
                width: props.width ?? 24,
                position: "relative",
            }}
        >
            {props.dexMon && (
                <SpriteImg
                    src={makeSpriteUrl(props.dexMon)}
                    alt={props.dexMon.displayName + " Sprite"}
                ></SpriteImg>
            )}
        </div>
    );
}
