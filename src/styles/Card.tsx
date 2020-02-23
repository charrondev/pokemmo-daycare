/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { StyledFactory } from "@pokemmo/styles/styledUtils";
import {
    colorText,
    boxShadowCard,
    borderRadius,
} from "@pokemmo/styles/variables";

export const Card = StyledFactory(
    "div",
    {
        background: "#fff",
        color: colorText.string(),
        boxShadow: boxShadowCard,
        padding: 16,
        borderRadius: borderRadius,
    },
    "Card",
);
