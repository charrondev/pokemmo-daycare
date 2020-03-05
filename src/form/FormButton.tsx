/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
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
    ICON = "icon",
    TEXT = "text",
}

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    buttonType?: ButtonType;
}

export const buttonCommonCSS: CssType = {
    appearance: "none",
    padding: "4px 12px",
    minHeight: 36,
    minWidth: 80,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",

    "&[disabled]": {
        opacity: 0.6,
        cursor: "initial",
    },
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

    [`&:not(:disabled):focus, &:not(:disabled):hover, &:not(:disabled):active`]: {
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

    [`&:not(:disabled):focus, &:not(:disabled):hover, &:not(:disabled):active`]: {
        ...mixinBorder(colorBorder),
        background: standardColorState.string(),
        borderWidth: 2,
    },
};

const textCSS: CssType = {
    ...mixinBorder(colorBorder),
    borderColor: "transparent",
    background: "transparent",
    borderWidth: 2,
    fontWeight: 500,
    minWidth: "initial",
    color: colorPrimary.string(),

    [`&:not(:disabled):focus, &:not(:disabled):hover, &:not(:disabled):active`]: {
        color: colorPrimary.darken(0.3).string(),
    },
};

const white = Color("#fff");

const translucentCSS: CssType = {
    ...mixinBorder(white),
    background: white.alpha(0.08).string(),
    color: white.string(),

    [`&:not(:disabled):focus, &:not(:disabled):hover, &:not(:disabled):active`]: {
        background: white.alpha(0.12).string(),
    },
};

const buttonIcon: CssType = {
    border: "none",
    borderRadius: 6,
    background: white.alpha(0.08).string(),
    color: colorPrimary.string(),
    minWidth: 24,
    minHeight: 24,
    padding: "6px 6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    [`&:not(:disabled):focus, &:not(:disabled):hover, &:not(:disabled):active`]: {
        background: colorPrimary.alpha(0.15).string(),
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
        case ButtonType.ICON:
            return buttonIcon;
        case ButtonType.TEXT:
            return textCSS;
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
            css={[
                props.className,
                buttonCommonCSS,
                cssForButtonType(buttonType),
            ]}
        />
    );
});
