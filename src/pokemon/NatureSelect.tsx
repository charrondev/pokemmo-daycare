/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { FormSelect, FormSelectProps } from "@pokemmo/form/FormSelect";
import * as natures from "@pokemmo/pokemon/natures";
import { NatureView } from "@pokemmo/projects/NatureView";
import React from "react";
import { FormatOptionLabelMeta, OptionTypeBase } from "react-select";
import { Nature } from "@pokemmo/pokemon/IVUtils";

export interface NatureSelectOptionType extends OptionTypeBase {
    nature: Nature;
    label: string;
    value: string;
}

const natureOptions = Object.values(natures).map(nature => {
    return {
        label: nature.name,
        value: nature.name,
        nature,
    };
});

interface IProps extends FormSelectProps<NatureSelectOptionType> {}

export function NatureSelect(props: IProps) {
    return (
        <FormSelect
            isClearable
            {...props}
            options={natureOptions}
            formatOptionLabel={formatNatureLabel}
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
