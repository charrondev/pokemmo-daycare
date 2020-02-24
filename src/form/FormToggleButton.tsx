/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React, { useState, useEffect, useRef } from "react";
import { useField, useFormikContext } from "formik";
import {
    colorInput,
    makeSingleBorder,
    colorPrimary,
    colorText,
    borderRadius,
    colorInputState,
    colorBorder,
    fontSizeSmall,
    fontSizeNormal,
} from "@pokemmo/styles/variables";
import { useLabelID, useInputID } from "@pokemmo/form/FormLabel";
import {
    colorPrimaryButton,
    primaryButtonFocusBoxShadow,
} from "@pokemmo/form/FormButton";

export interface IToggleButtonOption {
    value: string;
    label: string;
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    options: IToggleButtonOption[];
    fieldName: string;
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

    useEffect(() => {
        if (needsSelfFocus) {
            if (currentRef.current !== document.activeElement) {
                currentRef.current?.focus();
            }
            setNeedsSelfFocus(false);
        }
    }, [needsSelfFocus]);

    return (
        <div
            id={inputID}
            aria-labelledby={labelID}
            role="radiogroup"
            css={{
                background: colorInput.string(),
                border: makeSingleBorder(2),
                display: "inline-flex",
                borderRadius: borderRadius,
            }}
        >
            {props.options.map((option, index) => {
                const isPressed = field.value === option.value;
                return (
                    <button
                        onKeyDown={event => {
                            const firstOption = props.options[0] ?? null;
                            const lastOption =
                                props.options[props.options.length - 1] ?? null;
                            const isFirst = index === 0;
                            const isLast = index === props.options.length - 1;
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
                                fieldHelpers.setValue(targetOption.value);
                                setNeedsSelfFocus(true);
                            }
                        }}
                        ref={isPressed ? currentRef : undefined}
                        css={[
                            {
                                position: "relative",
                                appearance: "none",
                                color: colorText.string(),
                                background: colorInput.string(),
                                transition: "all ease 0.2s",
                                padding: "9px 24px",
                                fontWeight: "bold",
                                fontSize: fontSizeNormal,
                                lineHeight: "22px",
                                border: "none",
                                cursor: "pointer",
                                "&:after": {
                                    content: "''",
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    height: "100%",
                                    zIndex: 1,
                                    left: "100%",
                                    bottom: 0,
                                    width: 2,
                                    background: colorBorder.string(),
                                },
                                ["&:active, &:focus, &:hover"]: {
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
                                color: "#fff",
                                ["&:active, &:focus, &:hover"]: {
                                    background: colorPrimary.string(),
                                },
                                "&.focus-visible": {
                                    "&:after": {
                                        display: "none",
                                    },
                                    zIndex: 1,
                                    boxShadow: primaryButtonFocusBoxShadow,
                                },
                            },
                        ]}
                        tabIndex={isPressed ? 0 : -1}
                        key={option.value}
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
                );
            })}
        </div>
    );
}
