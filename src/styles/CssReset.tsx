/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { css, Global } from "@emotion/core";
import {
    colorBG,
    colorPrimary,
    colorText,
    fontSizeLarge,
    fontSizeTitle,
    fontSizeTitleLarge,
} from "@pokemmo/styles/variables";
import "@reach/dialog/styles.css";
import "@reach/menu-button/styles.css";
import emotionNormalize from "emotion-normalize";
import "focus-visible";
import React from "react";

export function CssReset() {
    return (
        <Global
            styles={css`
                ${emotionNormalize}
                html, body, #root {
                    height: 100%;
                }

                body {
                    background: ${colorBG.string()};
                    color: ${colorText.string()};
                    box-sizing: border-box;
                }
                *,
                *:before,
                *:after {
                    box-sizing: inherit;
                }

                li,
                ul,
                ol {
                    padding: 0;
                    margin: 0;
                    list-style: none;
                }

                /*
                 * This will hide the focus indicator if the element receives focus via the mouse,
                 * but it will still show up on keyboard focus.
                 */
                .js-focus-visible * {
                    outline: none;
                }

                .focus-visible {
                    box-shadow: 0 0 0 3px ${colorPrimary.lighten(0.7).string()};
                }

                a {
                    color: ${colorPrimary.toString()};
                    text-decoration: none;
                }

                a:hover,
                a.focus-visible,
                a:active {
                    text-decoration: underline;
                    box-shadow: none;
                }

                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    display: block;
                    line-height: 1.25;
                    font-weight: bold;
                    margin-top: 0;
                    margin-bottom: 16px;
                }

                p {
                    margin-bottom: 16px;
                }

                h1 {
                    font-size: ${fontSizeTitleLarge};
                }

                h2 {
                    font-size: ${fontSizeTitle};
                }

                h3 {
                    font-size: ${fontSizeLarge};
                }
            `}
        />
    );
}
