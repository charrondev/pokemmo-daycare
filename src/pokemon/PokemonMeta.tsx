/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { LabelAndValue } from "@pokemmo/form/LabelAndValue";
import { Gender, IVRequirements } from "@pokemmo/pokemon/PokemonTypes";
import { IVView } from "@pokemmo/projects/IVView";
import { NatureView } from "@pokemmo/projects/NatureView";
import { uppercaseFirst } from "@pokemmo/utils";
import React from "react";

interface IProps {
    identifier?: string;
    nature?: string | null;
    gender?: Gender;
    ivs?: IVRequirements;
    vertical?: boolean;
}

export function PokemonMeta(props: IProps) {
    let hasStats = false;
    if (props.ivs) {
        Object.values(props.ivs).forEach(stat => {
            if (stat?.value !== 0) {
                hasStats = true;
            }
        });
    }
    return (
        <>
            {props.gender && (
                <LabelAndValue vertical={props.vertical} label="Gender">
                    {uppercaseFirst(props.gender)}
                    {props.gender === Gender.MALE ? "♂" : "♀"}
                </LabelAndValue>
            )}
            {hasStats && props.ivs && (
                <LabelAndValue vertical={props.vertical} label="Stats">
                    <IVView ivRequirements={props.ivs} />
                </LabelAndValue>
            )}
            {props.nature && (
                <LabelAndValue vertical={props.vertical} label="Nature">
                    <NatureView nature={props.nature} />
                </LabelAndValue>
            )}
        </>
    );
}
