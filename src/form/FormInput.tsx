/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { FormError } from "@pokemmo/form/FormError";
import { useLabeledInputProps } from "@pokemmo/form/FormLabel";
import {
    borderRadius,
    colorBorder,
    colorInput,
    colorPrimary,
    colorPrimaryState,
    colorText,
    CssType,
    makeSingleBorder,
} from "@pokemmo/styles/variables";
import { numberWithCommas } from "@pokemmo/utils";
import { FieldMetaProps, useField } from "formik";
import React, { useState } from "react";

export const inputFocusCSS: CssType = {
    background: "#fff",
    borderColor: colorPrimary.lighten(0.6).string(),
};

export const inputCSS: CssType = {
    // Clear builtin "border".
    display: "inline-flex",
    alignItems: "center",
    borderRadius: borderRadius,
    boxShadow: "none",
    background: colorInput.string(),
    border: makeSingleBorder(2),
    borderWidth: 2,
    borderColor: colorBorder.string(),
    transition: "all ease 0.2s",
    minWidth: 200,
    width: "100%",
    color: colorText.string(),
    [`&:hover, &:focus, &.active`]: {
        borderColor: colorPrimaryState.string(),
    },
    "&&:focus": inputFocusCSS,
};

interface IProps<ValueType extends string | number>
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "onChange" | "value"
    > {
    beforeNode?: React.ReactNode;
    value?: ValueType;
    onChange?: (value: ValueType) => void;
    onTouched?: (isTouched: boolean) => void;
    meta?: FieldMetaProps<ValueType>;
}

export function FormInput<ValueType extends string | number = string>(
    _props: IProps<ValueType>,
) {
    const idProps = useLabeledInputProps();
    const { beforeNode, meta, onTouched, ...props } = _props;
    const [hasFocus, setHasFocus] = useState(false);

    let value = props.value ? props.value.toString() : "";
    if (props.type === "number") {
        value = numberWithCommas(value);
    }

    return (
        <>
            <span
                css={[
                    inputCSS,
                    {
                        paddingTop: 9,
                        paddingBottom: 9,
                        paddingLeft: 12,
                        paddingRight: 12,
                    },
                    hasFocus && { "&&": inputFocusCSS },
                ]}
            >
                {beforeNode && (
                    <span css={{ marginRight: 6 }}>{beforeNode}</span>
                )}
                <input
                    {...idProps}
                    {...props}
                    value={value}
                    type="text"
                    onChange={event => {
                        onTouched?.(true);
                        event.preventDefault();
                        if (props.type === "number") {
                            const commasStripped = event.target.value.replace(
                                /,/g,
                                "",
                            );
                            let number: number | null = parseInt(
                                commasStripped,
                                10,
                            );
                            if (Number.isNaN(number)) {
                                number = null;
                            }

                            if (
                                typeof props.max === "number" &&
                                number !== null
                            ) {
                                number = Math.min(props.max, number);
                            }

                            if (
                                typeof props.min === "number" &&
                                number !== null
                            ) {
                                number = Math.max(props.min, number);
                            }

                            props.onChange?.(number as any);
                        } else {
                            props.onChange?.(event.target.value as any);
                        }
                    }}
                    onFocus={() => setHasFocus(true)}
                    onBlur={e => {
                        setHasFocus(false);
                        props.onBlur?.(e);
                    }}
                    css={{
                        appearance: "none",
                        background: "none",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        flex: 1,
                        color: "inherit",
                    }}
                />
            </span>
            {meta?.touched && meta.error && <FormError>{meta.error}</FormError>}
        </>
    );
}

export function FormInputField<ValueType extends string | number = string>(
    _props: Omit<IProps<ValueType>, "meta" | "onTouched"> & {
        fieldName: string;
    },
) {
    const { fieldName, ...props } = _props;
    const [field, meta, helpers] = useField(fieldName);

    return (
        <FormInput
            {...props}
            {...field}
            meta={meta}
            onChange={helpers.setValue}
            onTouched={helpers.setTouched}
        />
    );
}
