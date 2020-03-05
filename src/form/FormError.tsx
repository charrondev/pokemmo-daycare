/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { fontSizeSmall } from "@pokemmo/styles/variables";
import React from "react";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormError(props: IProps) {
    return (
        <div
            {...props}
            css={{
                color: "red",
                fontSize: fontSizeSmall,
                position: "absolute",
                top: "100%",
                left: 0,
            }}
        />
    );
}
