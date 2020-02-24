/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { FormSelect, FormSelectProps } from "@pokemmo/form/FormSelect";
import { NatureView } from "@pokemmo/projects/NatureView";
import React from "react";
import { FormatOptionLabelMeta, OptionTypeBase } from "react-select";
import { Nature } from "@pokemmo/pokemon/IVUtils";
import { allNatures, getNature } from "@pokemmo/pokemon/natures";
import { notEmpty } from "@pokemmo/utils";

export interface NatureSelectOptionType extends OptionTypeBase {
    nature: Nature;
    label: string;
    value: string;
}

function natureToOption(nature: Nature | null) {
    if (!nature) {
        return null;
    }
    return {
        label: nature.name,
        value: nature.name,
        nature,
    };
}
const natureOptions = Object.values(allNatures)
    .map(natureToOption)
    .filter(notEmpty);

interface IProps
    extends Omit<
        FormSelectProps<NatureSelectOptionType>,
        "formatOptionsLabel" | "options" | "makeOptionFromValue"
    > {}

export function NatureSelect(props: IProps) {
    return (
        <FormSelect<NatureSelectOptionType>
            isClearable
            {...props}
            options={natureOptions}
            formatOptionLabel={formatNatureLabel}
            makeOptionFromValue={value => {
                return natureToOption(getNature(value));
            }}
        />
    );
}
const formatNatureLabel = (
    option: OptionTypeBase,
    meta: FormatOptionLabelMeta<any>,
) => {
    if (meta.context === "menu") {
        return <NatureView nature={option.nature} />;
    }
    return option.label;
};
