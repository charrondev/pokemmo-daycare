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

export enum ButtonType {
    PRIMARY = "primary",
    STANDARD = "standard",
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

const primaryCSS: CssType = {
    ...mixinBorder(colorPrimaryState),
    background: colorPrimaryState.string(),
    borderWidth: 2,
    color: "#fff",

    [`&:focus, &:hover, &:active`]: {
        ...mixinBorder(colorPrimary),
        background: colorPrimary.string(),
        borderWidth: 2,
    },
    "&.focus-visible": {
        boxShadow: `0 0 0 3px ${colorPrimary.lighten(0.7)}`,
    },
};

const standardCSS: CssType = {
    ...mixinBorder(colorInput),
    background: colorInput.string(),
    borderWidth: 2,
    color: colorText.string(),

    [`&:focus, &:hover, &:active`]: {
        ...mixinBorder(colorInputState),
        background: colorInputState.string(),
        borderWidth: 2,
    },
};

export function cssForButtonType(buttonType?: ButtonType): CssType {
    switch (buttonType) {
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
            ref={ref}
            css={[props.className, buttonCommon, cssForButtonType(buttonType)]}
        />
    );
});
