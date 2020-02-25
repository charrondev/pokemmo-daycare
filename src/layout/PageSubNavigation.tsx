/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { colorBG } from "@pokemmo/styles/variables";
import React from "react";

interface IProps {
    className?: string;
    children: React.ReactNode;
}

export function PageSubNavigation(props: IProps) {
    return (
        <nav
            className={props.className}
            css={{
                background: colorBG.string(),
                padding: 16,
                overflow: "auto",
            }}
        >
            {props.children}
        </nav>
    );
}
