/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { useUniqueID } from "@pokemmo/utils";
import React from "react";
import { OptionTypeBase } from "react-select";

export interface ISelectSimpleOption extends OptionTypeBase {
    value: string;
    label: string;
}

interface IProps
    extends Omit<React.HTMLAttributes<HTMLLabelElement>, "onChange"> {
    label: string;
    options: ISelectSimpleOption[];
    value: string;
    onChange: (newValue: string) => void;
}

export function FormSelectSimple(_props: IProps) {
    const { label, options, value, onChange, ...props } = _props;
    const labelID = useUniqueID("selectSimpleLabel");
    const inputID = useUniqueID("selectSimpleDropdown");

    return (
        <label
            {...props}
            css={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
            }}
            id={labelID}
            htmlFor={inputID}
        >
            <span>{label}:</span>
            <select
                css={{
                    appearance: "none",
                    border: "none",
                    background: "none",
                    color: "inherit",
                    fontWeight: "bold",
                    paddingLeft: 6,
                    cursor: "pointer",
                    "::after": {
                        content: "'▾'",
                    },
                }}
                id={inputID}
                aria-labelledby={labelID}
                value={value}
                onChange={event => {
                    event.preventDefault();
                    onChange(event.currentTarget.value);
                }}
            >
                {options.map((opt, i) => {
                    return (
                        <option key={i} value={opt.value}>
                            {opt.label}
                        </option>
                    );
                })}
            </select>
            <span
                css={{
                    fontFamily: "Lucida Grande",
                    padding: "0 6px",
                    position: "relative",
                    top: -1,
                }}
            >
                ▾
            </span>
        </label>
    );
}
