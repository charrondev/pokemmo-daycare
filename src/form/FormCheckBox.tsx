/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import {
    colorPrimary,
    makeSingleBorder,
    mixinAbsoluteFull,
    mixinSrOnly,
} from "@pokemmo/styles/variables";
import { useUniqueID } from "@pokemmo/utils";
import React from "react";

interface IProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (isChecked?: boolean) => void;
    label: string;
}

export function FormCheckBox(_props: IProps) {
    const { onChange, label, ...props } = _props;
    const id = useUniqueID("checkbox");

    return (
        <label
            htmlFor={id}
            css={{ display: "inline-flex", alignItems: "center" }}
        >
            <input
                id={id}
                type="checkbox"
                {...props}
                onChange={e => {
                    onChange?.(e.target.checked);
                }}
                css={{
                    ...mixinSrOnly(),
                    "&:hover, &:active, &.focus-visible": {
                        "& + .fakeCheck": {
                            background: colorPrimary
                                .lighten(0.99)
                                .fade(0.5)
                                .toString(),
                            borderColor: colorPrimary.toString(),
                            color: colorPrimary.toString(),
                        },
                    },
                }}
            />
            <span
                aria-hidden={true}
                className="fakeCheck"
                css={[
                    {
                        transition: "all 0.2s ease",
                        border: makeSingleBorder(2),
                        borderRadius: 4,
                        background: "#fff",
                        color: "#fff",
                        width: 18,
                        height: 18,
                        padding: 0,
                        display: "inline-block",
                        position: "relative",
                        cursor: "pointer",
                    },
                    props.checked && {
                        background: colorPrimary.toString(),
                        borderColor: colorPrimary.toString(),
                    },
                ]}
            >
                {props.checked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        css={{
                            ...mixinAbsoluteFull(),
                            height: 10,
                            width: 10,
                            margin: "auto",
                        }}
                    >
                        <title>✓</title>
                        <path
                            fill="currentColor"
                            d="M10,2.7c0-0.2-0.1-0.3-0.2-0.4L8.9,1.3c-0.2-0.2-0.6-0.2-0.9,0L3.8,5.6L1.9,3.7c-0.2-0.2-0.6-0.2-0.9,0L0.2,4.6c-0.2,0.2-0.2,0.6,0,0.9l3.2,3.2c0.2,0.2,0.6,0.2,0.9,0l5.5-5.5C9.9,3,10,2.8,10,2.7z"
                        />
                    </svg>
                )}
            </span>
            <span css={{ marginLeft: 8 }}>{label}</span>
        </label>
    );
}
