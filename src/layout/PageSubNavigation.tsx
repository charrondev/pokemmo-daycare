/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
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
                paddingTop: 46,
                overflow: "auto",
            }}
        >
            {props.children}
        </nav>
    );
}
