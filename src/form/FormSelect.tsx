/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import makeAnimated from "react-select/animated";
import Select from "react-select/async";
import {
    colorPrimaryState,
    colorPrimary,
    colorInput,
    makeSingleBorder,
    colorBorder,
    colorInputState,
} from "@pokemmo/styles/variables";

const animatedComponents = makeAnimated();

interface IProps extends React.ComponentProps<typeof Select> {}

const indicatorStyles = {
    color: colorPrimaryState.string(),
    "&:hover, &:focus, &:active": {
        color: colorPrimary.string(),
    },
};

export function FormSelect(props: IProps) {
    return (
        <Select
            {...props}
            cacheOptions
            components={animatedComponents}
            css={{
                "& input": {
                    boxShadow: "none !important",
                },
            }}
            styles={{
                valueContainer: provided => ({
                    ...provided,
                    paddingLeft: 12,
                    paddingRight: 12,
                }),
                dropdownIndicator: provided => {
                    return {
                        ...provided,
                        ...indicatorStyles,
                    };
                },
                indicatorSeparator: provided => {
                    return {
                        ...provided,
                        ...indicatorStyles,
                        width: 2,
                    };
                },
                clearIndicator: provided => {
                    return {
                        ...provided,
                        ...indicatorStyles,
                    };
                },
                control: (provided, state) => {
                    return {
                        ...provided,
                        // Clear builtin "border".
                        boxShadow: "none",
                        background: colorInput.string(),
                        border: makeSingleBorder(2),
                        borderWidth: 2,
                        borderColor: colorBorder.string(),
                        [`&:hover, &:focus, &.active`]: {
                            background: colorInputState.string(),
                            borderColor: colorPrimaryState.string(),
                        },
                        ["&&"]: state.isFocused
                            ? {
                                  background: "#fff",
                                  borderColor: colorPrimary
                                      .lighten(0.6)
                                      .string(),
                              }
                            : {},
                    };
                },
            }}
            getOptionValue={option => {
                return option.value;
            }}
        />
    );
}
