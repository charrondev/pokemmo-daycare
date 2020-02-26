/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import {
    colorBorder,
    colorPrimary,
    colorText,
    CssType,
    mixinBorder,
} from "@pokemmo/styles/variables";
import Color from "color";
import React from "react";

export enum ButtonType {
    PRIMARY = "primary",
    STANDARD = "standard",
    SUBMIT = "submit",
    TRANSLUSCENT = "transcluscent",
}

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    buttonType?: ButtonType;
}

const buttonCommon: CssType = {
    appearance: "none",
    padding: "4px 12px",
    minHeight: 36,
    minWidth: 80,
    cursor: "pointer",
    transition: "all 0.2s ease",
};

export const colorPrimaryButton = colorPrimary.lighten(0.2);
export const primaryButtonFocusBoxShadow = `0 0 0 3px ${colorPrimary.lighten(
    0.7,
)}`;

const primaryCSS: CssType = {
    ...mixinBorder(colorPrimaryButton),
    background: colorPrimaryButton.string(),
    borderWidth: 2,
    color: "#fff",

    [`&:focus, &:hover, &:active`]: {
        ...mixinBorder(colorPrimary),
        background: colorPrimary.string(),
        borderWidth: 2,
    },
    "&.focus-visible": {
        boxShadow: primaryButtonFocusBoxShadow,
    },
};

const standardColor = Color("#F4F5F7");
const standardColorState = standardColor.darken(0.05);

const standardCSS: CssType = {
    ...mixinBorder(colorBorder),
    background: standardColor.string(),
    borderWidth: 2,
    color: colorText.string(),

    [`&:focus, &:hover, &:active`]: {
        ...mixinBorder(colorBorder),
        background: standardColorState.string(),
        borderWidth: 2,
    },
};

const white = Color("#fff");

const translucentCSS: CssType = {
    ...mixinBorder(white),
    background: white.alpha(0.08).string(),
    color: white.string(),

    [`&:focus, &:hover, &:active`]: {
        background: white.alpha(0.12).string(),
    },
};

export function cssForButtonType(buttonType?: ButtonType): CssType {
    switch (buttonType) {
        case ButtonType.SUBMIT:
        case ButtonType.PRIMARY:
            return primaryCSS;
        case ButtonType.TRANSLUSCENT:
            return translucentCSS;
        case ButtonType.STANDARD:
            return standardCSS;
        default:
            return standardCSS;
    }
}

export const FormButton = React.forwardRef(function FormButton(
    _props: IProps,
    ref: React.Ref<HTMLButtonElement>,
) {
    const { buttonType, ...props } = _props;

    return (
        <button
            {...props}
            type={buttonType === ButtonType.SUBMIT ? "submit" : "button"}
            ref={ref}
            css={[props.className, buttonCommon, cssForButtonType(buttonType)]}
        />
    );
});
