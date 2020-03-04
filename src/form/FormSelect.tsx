/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { FormError } from "@pokemmo/form/FormError";
import { inputCSS, inputFocusCSS } from "@pokemmo/form/FormInput";
import { useLabeledInputProps } from "@pokemmo/form/FormLabel";
import { BaseFormSelectProps } from "@pokemmo/form/FormSelectProps";
import { colorPrimary, colorPrimaryState } from "@pokemmo/styles/variables";
import { FieldMetaProps, useField } from "formik";
import React, { useEffect } from "react";
import Select, { ValueType } from "react-select";
import makeAnimated from "react-select/animated";
import AsyncSelect, { AsyncProps } from "react-select/async";

const animatedComponents = makeAnimated();

export interface FormSelectProps<T>
    extends Omit<BaseFormSelectProps<any>, "onChange" | "value">,
        Partial<AsyncProps<any>> {
    // fieldName: string;
    makeOptionFromValue: (value: string | null) => ValueType<T> | null;
    meta?: FieldMetaProps<T>;
    onTouched?: (isTouched: boolean) => void;
    onChange: (values: string[] | string | null) => void;
    value: string | string[] | null;
}

export type FormSelectFieldProps<T> = Omit<
    FormSelectProps<T>,
    "onChange" | "value" | "meta" | "onTouched"
> & { fieldName: string; forceValue?: string };

export type SpecializedSelect<T> = Omit<
    T,
    "formatOptionsLabel" | "options" | "makeOptionFromValue"
>;

const indicatorStyles = {
    color: colorPrimaryState.string(),
    "&:hover, &:focus, &:active": {
        color: colorPrimary.string(),
    },
};

export function FormSelect<T extends { value: string }>(
    _props: FormSelectProps<T>,
) {
    const {
        value: propValue,
        meta,
        onChange,
        onTouched,
        makeOptionFromValue,
        ...props
    } = _props;

    const ids = useLabeledInputProps();

    const SelectComponent = props.loadOptions
        ? AsyncSelect
        : ((Select as any) as typeof AsyncSelect);

    let value: any = null;
    if (Array.isArray(propValue)) {
        value = propValue.map(val => makeOptionFromValue(val));
    } else {
        value = makeOptionFromValue(propValue);
    }

    return (
        <>
            <SelectComponent
                {...(props as any)}
                value={value}
                onChange={(value: any) => {
                    onTouched?.(true);
                    if (Array.isArray(value)) {
                        onChange(value.map(val => val?.value ?? value));
                    } else {
                        onChange(value?.value ?? null);
                    }
                }}
                {...ids}
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
                            ...(props.isMulti
                                ? {
                                      "& > *:first-child": {
                                          padding: "4px 8px",
                                      },
                                  }
                                : {}),
                        };
                    },
                }}
            />
            {meta?.touched && meta.error && <FormError>{meta.error}</FormError>}
        </>
    );
}

export function FormSelectField<T extends { value: string }>(
    _props: FormSelectFieldProps<T> & {
        initialValue?: string | string[];
    },
) {
    const { fieldName, forceValue, initialValue, ...props } = _props;
    const [field, meta, fieldHelpers] = useField({
        name: fieldName,
        type: "select",
    });

    useEffect(() => {
        fieldHelpers.setValue(initialValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValue]);

    return (
        <FormSelect
            {...field}
            onTouched={fieldHelpers.setTouched}
            {...props}
            value={forceValue ? forceValue : field.value}
            isDisabled={forceValue != null ? !!forceValue : props.isDisabled}
            onChange={value => {
                fieldHelpers.setValue(value);
            }}
            meta={meta}
        />
    );
}
