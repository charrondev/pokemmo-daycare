/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { useField } from "formik";
import { useLabelID, useLabeledInputProps } from "@pokemmo/form/FormLabel";
import {
    makeSingleBorder,
    colorPrimary,
    colorInput,
    CssType,
    colorBorder,
    colorInputState,
    colorPrimaryState,
    borderRadius,
} from "@pokemmo/styles/variables";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    fieldName: string;
}

export const inputFocusCSS: CssType = {
    background: "#fff",
    borderColor: colorPrimary.lighten(0.6).string(),
};

export const inputCSS: CssType = {
    // Clear builtin "border".
    borderRadius: borderRadius,
    boxShadow: "none",
    background: colorInput.string(),
    border: makeSingleBorder(2),
    borderWidth: 2,
    borderColor: colorBorder.string(),
    transition: "all ease 0.2s",
    minWidth: 320,
    [`&:hover, &:focus, &.active`]: {
        background: colorInputState.string(),
        borderColor: colorPrimaryState.string(),
    },
    ["&:focus"]: inputFocusCSS,
};

export function FormInput(_props: IProps) {
    const idProps = useLabeledInputProps();
    const { fieldName, ...props } = _props;
    const [field] = useField(fieldName);

    return (
        <input
            {...idProps}
            {...field}
            css={[
                inputCSS,
                {
                    paddingTop: 9,
                    paddingBottom: 9,
                    paddingLeft: 12,
                    paddingRight: 12,
                },
            ]}
        />
    );
}
