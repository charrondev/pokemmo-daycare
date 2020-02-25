/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { fontSizeSmall } from "@pokemmo/styles/variables";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormError(props: IProps) {
    return (
        <div
            {...props}
            css={{
                color: "red",
                fontSize: fontSizeSmall,
            }}
        />
    );
}
