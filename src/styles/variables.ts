/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import Color from "color";
import { ObjectInterpolation } from "@emotion/core";
export type CssType = ObjectInterpolation<any>;

// Colors
export const colorBG = Color("#F9FAFF");
export const colorPrimary = Color("#4A4F73");
export const colorPrimaryState = colorPrimary.lighten(0.6);
export const colorSecondary = Color("#B07B7B");
export const colorSecondaryState = colorSecondary.darken(0.18);
export const colorInput = Color("#FAFBFC");
export const colorInputState = colorInput.darken(0.02);
export const colorBorder = Color("#DEE0E6");
export const colorText = colorPrimary;

// fonts

export const fontSizeSmall = 12;
export const fontSizeNormal = 14;
export const fontSizeLarge = 16;
export const fontSizeTitleSmall = 18;
export const fontSizeTitle = 22;
export const fontSizeTitleLarge = 36;

// Dimensions

export const containerSize = 1450;

// Other
export const borderRadius = 6;
export const boxShadowCard = "0 4px 20px 0 rgba(0, 0, 0, 0.1)";

export const mixinBorder = (color = colorBorder): CssType => ({
    borderColor: color.string(),
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius,
});

export const makeSingleBorder = (width: number) =>
    `${width}px solid ${colorBorder.string()}`;
