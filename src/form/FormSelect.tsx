/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { FormError } from "@pokemmo/form/FormError";
import { inputCSS, inputFocusCSS } from "@pokemmo/form/FormInput";
import { useInputID, useLabelID } from "@pokemmo/form/FormLabel";
import { BaseFormSelectProps } from "@pokemmo/form/FormSelectProps";
import { colorPrimary, colorPrimaryState } from "@pokemmo/styles/variables";
import { useField } from "formik";
import React from "react";
import Select, { ValueType } from "react-select";
import makeAnimated from "react-select/animated";
import AsyncSelect, { AsyncProps } from "react-select/async";

const animatedComponents = makeAnimated();

export interface FormSelectProps<T>
    extends BaseFormSelectProps<T>,
        Partial<AsyncProps<T>> {
    fieldName: string;
    makeOptionFromValue: (value: string | null) => ValueType<T> | null;
}

const indicatorStyles = {
    color: colorPrimaryState.string(),
    "&:hover, &:focus, &:active": {
        color: colorPrimary.string(),
    },
};

export function FormSelect<T extends { value: string }>(
    _props: FormSelectProps<T>,
) {
    const { fieldName, makeOptionFromValue, ...props } = _props;
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
        <>
            <SelectComponent
                {...(props as any)}
                {...field}
                value={makeOptionFromValue(field.value)}
                onChange={(value: T | null) => {
                    fieldHelpers.setTouched(true);
                    fieldHelpers.setValue(value?.value ?? value);
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
                            "&&": state.isFocused ? inputFocusCSS : {},
                        };
                    },
                }}
            />
            {meta.touched && meta.error && <FormError>{meta.error}</FormError>}
        </>
    );
}
