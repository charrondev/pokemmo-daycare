/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { css } from "@emotion/core";
import { colorBorder } from "@pokemmo/styles/variables";
import React from "react";

interface IProps {
    vertical?: boolean;
    horizontal?: boolean;
    className?: string;
}

const verticalCSS = css({
    height: "100%",
    width: 1,
    background: colorBorder.toString(),
    display: "block",
    margin: "0 16px",
    border: "none",
    outline: "none",
});

const horizontalCSS = css({
    height: 1,
    width: "100%",
    background: colorBorder.toString(),
    display: "block",
    margin: "16px 0",
    border: "none",
    outline: "none",
});

export function Separator(props: IProps) {
    return (
        <hr
            css={[
                props.vertical && verticalCSS,
                props.horizontal && horizontalCSS,
            ]}
            className={props.className}
        />
    );
}
