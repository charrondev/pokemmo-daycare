/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ObjectInterpolation } from "@emotion/core";
import Color from "color";
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

export const mixinAbsoluteFull = (): CssType => {
    return {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };
};

export const mixinSrOnly = (): CssType => ({
    border: "0px !important",
    clip: "rect(0, 0, 0, 0) !important",
    display: "block !important",
    height: "1px !important",
    margin: "-1px !important",
    overflow: "hidden !important",
    padding: "0px !important",
    position: "absolute !important" as any,
    width: "1px !important",
});

export const mixinExtendContainer = (by: number): CssType => ({
    width: `calc(100% + ${by * 2}px)`,
    marginLeft: -by,
});
