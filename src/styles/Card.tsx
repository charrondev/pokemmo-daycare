/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { StyledFactory } from "@pokemmo/styles/styledUtils";
import {
    colorText,
    boxShadowCard,
    borderRadius,
    colorSecondary,
} from "@pokemmo/styles/variables";
import Color from "color";

export const Card = StyledFactory(
    "div",
    {
        background: "#fff",
        color: colorText.string(),
        boxShadow: boxShadowCard,
        padding: 16,
        borderRadius: borderRadius,
    },
    "Card",
);

export function DecoratedCard(
    _props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
        decorationColor?: Color;
    },
) {
    const { decorationColor = colorSecondary, ...props } = _props;
    return (
        <Card
            {...props}
            css={{
                position: "relative",
                paddingLeft: 16 + 6,
                "&::before": {
                    content: "''",
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 6,
                    background: decorationColor.string(),
                    borderTopLeftRadius: borderRadius,
                    borderBottomLeftRadius: borderRadius,
                },
            }}
        />
    );
}
