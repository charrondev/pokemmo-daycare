/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import {
    allEggGroups,
    stringToOption,
    useOwnEggGroups,
} from "@pokemmo/data/pokedex";
import {
    FormSelectField,
    FormSelectFieldProps,
    SpecializedSelect,
} from "@pokemmo/form/FormSelect";
import React from "react";

export interface EggGroupOption {
    label: string;
    value: string;
}

interface IProps
    extends SpecializedSelect<FormSelectFieldProps<EggGroupOption>> {
    onlyOwned?: boolean;
    fieldName: string;
}

export function EggGroupSelect(_props: IProps) {
    const { onlyOwned, ...props } = _props;
    const ownEggGroups = useOwnEggGroups();
    return (
        <FormSelectField<EggGroupOption>
            isClearable
            {...props}
            options={
                onlyOwned
                    ? ownEggGroups.map(stringToOption)
                    : allEggGroups.map(stringToOption)
            }
            makeOptionFromValue={value => {
                return value ? stringToOption(value) : null;
            }}
        />
    );
}
