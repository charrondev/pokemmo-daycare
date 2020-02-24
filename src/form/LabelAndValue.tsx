/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { fontSizeSmall, fontSizeNormal } from "@pokemmo/styles/variables";
import { Dirent } from "fs";

interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    label: string;
    inline?: boolean;
    vertical?: boolean;
}

export function LabelAndValue(_props: IProps) {
    const { label, vertical, inline, ...props } = _props;
    return (
        <label
            {...props}
            css={[
                { fontSize: fontSizeNormal, display: "block", marginBottom: 9 },
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
                    {
                        fontWeight: "bold",
                        marginRight: 6,
                    },
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
