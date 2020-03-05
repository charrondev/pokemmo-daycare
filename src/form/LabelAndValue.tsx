/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { CssType, fontSizeNormal } from "@pokemmo/styles/variables";
import React from "react";

interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    label: string;
    inline?: boolean;
    vertical?: boolean;
}

export const labelStyle: CssType = {
    fontSize: fontSizeNormal,
    fontWeight: "bold",
    whiteSpace: "nowrap",
    marginRight: 4,
};

export function LabelAndValue(_props: IProps) {
    const { label, vertical, inline, ...props } = _props;
    return (
        <label
            {...props}
            css={[
                {
                    display: "flex",
                    flexWrap: "wrap",
                    fontSize: fontSizeNormal,
                    alignItems: "center",
                    minHeight: 25,
                    padding: 4,
                },
                inline && {
                    display: "inline-block",
                },
                vertical && {
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: 0,
                    alignItems: "flex-start",
                },
            ]}
        >
            <strong
                css={[
                    labelStyle,
                    vertical && {
                        marginLeft: 0,
                        marginBottom: 6,
                    },
                ]}
            >
                {label}
                {vertical ? "" : ":"}
            </strong>
            <span css={[vertical && { margin: "4px 0" }]}>
                {props.children}
            </span>
        </label>
    );
}
