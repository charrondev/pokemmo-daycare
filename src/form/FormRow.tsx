/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { CssType } from "@pokemmo/styles/variables";
import React from "react";

export function FormRow(
    _props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
        firstItemStyles?: CssType;
        lastItemStyles?: CssType;
        itemStyles?: CssType;
        itemXPadding?: number;
        itemYPadding?: number;
    },
) {
    const {
        firstItemStyles = {},
        lastItemStyles = {},
        itemStyles = {},
        itemXPadding = 18,
        itemYPadding = 6,
        ...props
    } = _props;
    return (
        <div
            {...props}
            css={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: itemXPadding * 2,
                marginLeft: -itemXPadding,
                width: `calc(100% + ${itemXPadding * 2}px)`,
                "& > *": {
                    flex: 1,
                    flexGrow: 0,
                    minWidth: 400,
                    marginLeft: itemXPadding,
                    marginRight: itemXPadding,
                    marginTop: itemYPadding,
                    marginBottom: itemYPadding,
                    ...(itemStyles as any),
                },
                "& > *:first-of-type": {
                    ...(firstItemStyles as any),
                },
                "& > *:last-of-type": {
                    ...(lastItemStyles as any),
                },
            }}
        />
    );
}
