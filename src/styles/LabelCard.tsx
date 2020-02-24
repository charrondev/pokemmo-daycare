/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { Card } from "@pokemmo/styles/Card";
import { colorSecondary, borderRadius } from "@pokemmo/styles/variables";

export function LabelCard(
    props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
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
                    background: colorSecondary.string(),
                    borderTopLeftRadius: borderRadius,
                    borderBottomLeftRadius: borderRadius,
                },
            }}
        />
    );
}
