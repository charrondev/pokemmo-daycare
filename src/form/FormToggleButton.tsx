/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { colorPrimaryButton } from "@pokemmo/form/FormButton";
import { FormError } from "@pokemmo/form/FormError";
import { useInputID, useLabelID } from "@pokemmo/form/FormLabel";
import {
    borderRadius,
    colorBorder,
    colorInput,
    colorInputState,
    colorPrimary,
    colorText,
    fontSizeNormal,
    makeSingleBorder,
} from "@pokemmo/styles/variables";
import { useField } from "formik";
import React, { useEffect, useRef, useState } from "react";

export interface IToggleButtonOption {
    value: string;
    label: string;
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    options: IToggleButtonOption[];
    fieldName: string;
    forceValue?: string;
}

var KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    UP: 38,
};

export function FormToggleButton(props: IProps) {
    const inputID = useInputID();
    const labelID = useLabelID();
    const [field, meta, fieldHelpers] = useField(props.fieldName);
    const [needsSelfFocus, setNeedsSelfFocus] = useState(false);
    const currentRef = useRef<HTMLButtonElement>(null);

    const { forceValue } = props;

    useEffect(() => {
        if (forceValue) {
            fieldHelpers.setValue(forceValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forceValue]);

    useEffect(() => {
        if (needsSelfFocus) {
            if (currentRef.current !== document.activeElement) {
                currentRef.current?.focus();
            }
            setNeedsSelfFocus(false);
        }
    }, [needsSelfFocus]);

    return (
        <>
            <div
                id={inputID}
                aria-labelledby={labelID}
                role="radiogroup"
                css={[
                    {
                        background: colorInput.string(),
                        border: makeSingleBorder(2),
                        display: "inline-flex",
                        alignItems: "stretch",
                        borderRadius: borderRadius,

                        // Adjust offset for slightly changed.
                        margin: "1px 0",
                        marginBottom: 3,
                    },
                    forceValue && { opacity: 0.7, pointerEvents: "none" },
                ]}
            >
                {props.options.map((option, index) => {
                    const isPressed = field.value === option.value;
                    return (
                        <React.Fragment key={option.value}>
                            <button
                                disabled={!!forceValue}
                                type="button"
                                onKeyDown={event => {
                                    const firstOption =
                                        props.options[0] ?? null;
                                    const lastOption =
                                        props.options[
                                            props.options.length - 1
                                        ] ?? null;
                                    const isFirst = index === 0;
                                    const isLast =
                                        index === props.options.length - 1;
                                    let targetOption: IToggleButtonOption | null = null;
                                    switch (event.keyCode) {
                                        case KEYCODE.DOWN:
                                        case KEYCODE.RIGHT:
                                            targetOption = isLast
                                                ? firstOption
                                                : props.options[index + 1];
                                            break;
                                        case KEYCODE.UP:
                                        case KEYCODE.LEFT:
                                            targetOption = isFirst
                                                ? lastOption
                                                : props.options[index - 1];
                                            break;
                                    }

                                    if (targetOption) {
                                        event.preventDefault();
                                        fieldHelpers.setTouched(true);
                                        fieldHelpers.setValue(
                                            targetOption.value,
                                        );
                                        setNeedsSelfFocus(true);
                                    }
                                }}
                                ref={isPressed ? currentRef : undefined}
                                css={[
                                    {
                                        minWidth: 103,
                                        position: "relative",
                                        appearance: "none",
                                        color: colorText.string(),
                                        background: colorInput.string(),
                                        padding: "6px 24px",
                                        fontWeight: "bold",
                                        fontSize: fontSizeNormal,
                                        lineHeight: "22px",
                                        border: "none",
                                        cursor: "pointer",
                                        "&:active, &:focus, &:hover": {
                                            background: colorInputState.string(),
                                        },
                                        "&:first-of-type": {
                                            borderTopLeftRadius: 4,
                                            borderBottomLeftRadius: 4,
                                        },
                                        "&:last-of-type": {
                                            borderTopRightRadius: 4,
                                            borderBottomRightRadius: 4,
                                            "&:after": {
                                                display: "none",
                                            },
                                        },
                                    },
                                    isPressed && {
                                        border: "none",
                                        background: colorPrimaryButton.string(),
                                        boxShadow: `0 0 0 2px ${colorPrimaryButton.string()}`,
                                        color: "#fff",
                                        "&:active, &:focus, &:hover": {
                                            boxShadow: `0 0 0 2px ${colorPrimary.string()}`,
                                            background: colorPrimary.string(),
                                        },
                                        "&.focus-visible": {
                                            boxShadow: `0 0 0 2px ${colorPrimary.string()}, 0 0 0 4px ${colorPrimary.lighten(
                                                0.7,
                                            )}`,
                                            zIndex: 1,
                                        },
                                    },
                                ]}
                                tabIndex={isPressed ? 0 : -1}
                                role="radio"
                                aria-checked={isPressed}
                                aria-label={option.label}
                                onClick={() => {
                                    if (!isPressed) {
                                        fieldHelpers.setTouched(true);
                                        fieldHelpers.setValue(option.value);
                                    }
                                }}
                            >
                                {option.label}
                            </button>
                            <hr
                                aria-hidden={true}
                                css={{
                                    display: "block",
                                    height: 34,
                                    margin: "0 2px",
                                    width: 2,
                                    border: "none",
                                    outline: "none",
                                    background: colorBorder.string(),
                                    "&:last-of-type": {
                                        display: "none",
                                    },
                                }}
                            ></hr>
                        </React.Fragment>
                    );
                })}
            </div>
            {meta.touched && meta.error && <FormError>{meta.error}</FormError>}
        </>
    );
}
