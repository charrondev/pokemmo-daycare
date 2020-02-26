/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { useUniqueID } from "@pokemmo/utils";
import React from "react";
import { OptionTypeBase } from "react-select";

export interface ISelectSimpleOption extends OptionTypeBase {
    value: string;
    label: string;
}

interface IProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    label: string;
    options: ISelectSimpleOption[];
    value: string;
    onChange: (newValue: string) => void;
}

export function FormSelectSimple(_props: IProps) {
    const { label, options, value, onChange, ...props } = _props;
    const labelID = useUniqueID("selectSimpleLabel");
    const inputID = useUniqueID("selectSimpleDropdown");

    const selectedValue = options.find(option => option.value === value);

    return (
        <div
            {...props}
            css={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <label id={labelID} htmlFor={inputID}>
                {label}:
            </label>
            <select
                css={{
                    appearance: "none",
                    border: "none",
                    background: "none",
                    color: "inherit",
                    fontWeight: "bold",
                    paddingLeft: 6,
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
        </div>
    );
}
