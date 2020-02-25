/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
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
    marginBottom: 9,
    fontWeight: "bold",
    marginRight: 6,
};

export function LabelAndValue(_props: IProps) {
    const { label, vertical, inline, ...props } = _props;
    return (
        <label
            {...props}
            css={[
                { display: "block", fontSize: fontSizeNormal },
                inline && {
                    display: "inline-block",
                },
                vertical && {
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: 0,
                },
            ]}
        >
            <strong
                css={[
                    labelStyle,
                    vertical && {
                        marginRight: 0,
                        marginBottom: 6,
                    },
                ]}
            >
                {label}
                {vertical ? "" : ":"}
            </strong>
            <span>{props.children}</span>
        </label>
    );
}
