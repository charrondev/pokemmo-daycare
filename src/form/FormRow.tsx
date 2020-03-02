/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { CssType, mixinExtendContainer } from "@pokemmo/styles/variables";
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
                ...mixinExtendContainer(itemXPadding),
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

export function FormGrid(
    _props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
        itemStyles?: CssType;
        itemXPadding?: number;
        itemYPadding?: number;
        itemMinWidth?: number;
        itemMaxWidth?: number;
    },
) {
    const {
        itemStyles = {},
        itemXPadding = 18,
        itemYPadding = 18,
        itemMinWidth = 250,
        itemMaxWidth = 350,
        ...props
    } = _props;
    return (
        <div
            {...props}
            css={{
                gridTemplateColumns: `repeat(auto-fit, minmax(min(${itemMinWidth}px, ${itemMaxWidth}px), 1fr))`,
                gridAutoColumns: "max-content",
                display: "grid",
                ...mixinExtendContainer(itemXPadding),
                marginBottom: itemYPadding,
                "& > *": {
                    itemStyles,
                    marginLeft: itemXPadding,
                    marginRight: itemXPadding,
                    marginTop: itemYPadding,
                    marginBottom: itemYPadding,
                },
                // "& > *:first-of-type": {
                //     ...(firstItemStyles as any),
                // },
                // "& > *:last-of-type": {
                //     ...(lastItemStyles as any),
                // },
            }}
        />
    );
}
