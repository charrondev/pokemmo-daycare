/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { StyledFactory } from "@pokemmo/styles/styledUtils";
import {
    borderRadius,
    boxShadowCard,
    colorSecondary,
    colorText,
} from "@pokemmo/styles/variables";
import Color from "color";
import React from "react";

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
        hoverable?: boolean;
    },
) {
    const { decorationColor = colorSecondary, hoverable, ...props } = _props;
    return (
        <Card
            {...props}
            css={[
                {
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
                },
                hoverable && {
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover, &:focus, &:active": {
                        boxShadow: "0 8px 40px 0 rgba(0, 0, 0, 0.15)",
                    },
                },
            ]}
        />
    );
}
