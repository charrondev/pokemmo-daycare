/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { StyledFactory } from "@pokemmo/styles/styledUtils";
import { PokedexMon, makeSpriteUrl } from "@pokemmo/data/pokedex";

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
        transform: "scale(1.5)",
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