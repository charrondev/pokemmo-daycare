/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { fontSizeSmall, fontSizeNormal } from "@pokemmo/styles/variables";

interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    label: string;
    inline?: boolean;
}

export function LabelAndValue(_props: IProps) {
    const { label, ...props } = _props;
    return (
        <label
            {...props}
            css={[
                { fontSize: fontSizeNormal, display: "block", marginBottom: 9 },
                props.inline && {
                    display: "inline-block",
                },
            ]}
        >
            <strong
                css={[
                    {
                        fontWeight: "bold",
                        marginRight: 6,
                    },
                ]}
            >
                {label}:
            </strong>
            <span>{props.children}</span>
        </label>
    );
}
