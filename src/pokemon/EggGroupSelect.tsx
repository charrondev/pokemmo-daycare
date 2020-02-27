/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import {
    allEggGroups,
    stringToOption,
    useOwnEggGroups,
} from "@pokemmo/data/pokedex";
import { FormSelect, FormSelectProps } from "@pokemmo/form/FormSelect";
import React from "react";

export interface EggGroupOption {
    label: string;
    value: string;
}

interface IProps
    extends Omit<
        FormSelectProps<EggGroupOption>,
        "formatOptionsLabel" | "options" | "makeOptionFromValue"
    > {
    onlyOwned?: boolean;
}

export function EggGroupSelect(_props: IProps) {
    const { onlyOwned, ...props } = _props;
    const ownEggGroups = useOwnEggGroups();
    return (
        <FormSelect<EggGroupOption>
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
