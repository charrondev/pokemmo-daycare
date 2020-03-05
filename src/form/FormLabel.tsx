/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { fontSizeSmall } from "@pokemmo/styles/variables";
import { uniqueId } from "lodash-es";
import React, { useContext, useMemo } from "react";

const LabelContext = React.createContext({
    getLabelID: () => uniqueId("defaultLabelID") as string | undefined,
    getInputID: () => uniqueId("defaultInputID") as string | undefined,
});

export function useLabeledInputProps() {
    const { getLabelID, getInputID } = useContext(LabelContext);

    return {
        id: getInputID(),
        "aria-labelledby": getLabelID(),
    };
}

export function useLabelID() {
    const { getLabelID } = useContext(LabelContext);
    return getLabelID();
}

export function useInputID() {
    const { getInputID } = useContext(LabelContext);
    return getInputID();
}

interface IProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    label: React.ReactNode;
}

export function FormLabel(props: IProps) {
    const labelID = useMemo(() => {
        return uniqueId("formLabel");
    }, []);

    const inputID = useMemo(() => {
        return uniqueId("formLabel");
    }, []);

    return (
        <LabelContext.Provider
            value={{ getLabelID: () => labelID, getInputID: () => inputID }}
        >
            <label
                htmlFor={inputID}
                id={labelID}
                css={{ display: "block", position: "relative" }}
                {...props}
            >
                <div
                    css={{
                        fontWeight: "bold",
                        fontSize: fontSizeSmall,
                        display: "block",
                        marginBottom: 6,
                    }}
                >
                    {props.label}
                </div>
                <div css={{}}>{props.children}</div>
            </label>
        </LabelContext.Provider>
    );
}
