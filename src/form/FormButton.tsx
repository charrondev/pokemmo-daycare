/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import {
    mixinBorder,
    colorInput,
    colorPrimary,
    colorText,
    CssType,
    colorPrimaryState,
    colorInputState,
} from "@pokemmo/styles/variables";
import Color from "color";

export enum ButtonType {
    PRIMARY = "primary",
    STANDARD = "standard",
    SUBMIT = "submit",
}

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    buttonType?: ButtonType;
}

const t: IProps = {} as any;

const buttonCommon: CssType = {
    appearance: "none",
    padding: "4px 12px",
    minHeight: 36,
    minWidth: 60,
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
    ...mixinBorder(standardColor),
    background: standardColor.string(),
    borderWidth: 2,
    color: colorText.string(),

    [`&:focus, &:hover, &:active`]: {
        ...mixinBorder(standardColorState),
        background: standardColorState.string(),
        borderWidth: 2,
    },
};

export function cssForButtonType(buttonType?: ButtonType): CssType {
    switch (buttonType) {
        case ButtonType.SUBMIT:
        case ButtonType.PRIMARY:
            return primaryCSS;
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
