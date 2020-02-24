/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import makeAnimated from "react-select/animated";
import AsyncSelect, { Props as AsyncProps } from "react-select/async";
import Select, { Props as SelectProps } from "react-select";
import {
    colorPrimaryState,
    colorPrimary,
    colorInput,
    makeSingleBorder,
    colorBorder,
    colorInputState,
} from "@pokemmo/styles/variables";
import { useInputID, useLabelID } from "@pokemmo/form/FormLabel";
import { useField, useFormikContext } from "formik";
import { inputFocusCSS, inputCSS } from "@pokemmo/form/FormInput";

const animatedComponents = makeAnimated();

export interface FormSelectProps<T> extends Partial<AsyncProps<T>> {
    options?: SelectProps<T>["options"];
    fieldName: string;
}

const indicatorStyles = {
    color: colorPrimaryState.string(),
    "&:hover, &:focus, &:active": {
        color: colorPrimary.string(),
    },
};

export function FormSelect<T>(_props: FormSelectProps<T>) {
    const { fieldName, ...props } = _props;
    const [field, meta, fieldHelpers] = useField({
        name: fieldName,
        type: "select",
    });
    const inputID = useInputID();
    const labelID = useLabelID();

    const SelectComponent = props.loadOptions
        ? AsyncSelect
        : ((Select as any) as typeof AsyncSelect);

    return (
        <SelectComponent
            {...(props as any)}
            {...field}
            onChange={value => {
                fieldHelpers.setTouched(true);
                fieldHelpers.setValue(value);
            }}
            id={inputID}
            aria-labelledby={labelID}
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
                        ...inputCSS,
                        width: "100%",
                        ["&&"]: state.isFocused ? inputFocusCSS : {},
                    };
                },
            }}
        />
    );
}
