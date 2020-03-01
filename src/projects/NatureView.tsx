/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import styled from "@emotion/styled";
import { Nature } from "@pokemmo/pokemon/PokemonTypes";
import React from "react";

const NatureViewWrapper = styled.span<{ isVertical?: boolean }>`
    display: flex;

    ${props =>
        props.isVertical
            ? `
                flex-direction: column;
    `
            : `
                align-items: baseline;
                padding-left: 8,
                padding-bottom: 0,
        `}
`;

const StatModifierLabel = styled.span`
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 3px;
    display: inline-block;
    font-size: 0.6em;
`;

export function NatureView(props: {
    nature: Nature | null;
    isVertical?: boolean;
}) {
    return (
        <NatureViewWrapper isVertical={props.isVertical}>
            <span className="natureName">{props.nature?.name}</span>
            <span>
                {props.nature?.positiveStat && (
                    <StatModifierLabel>
                        +{props.nature.positiveStat}
                    </StatModifierLabel>
                )}
                {props.nature?.negativeStat && (
                    <StatModifierLabel>
                        -{props.nature.negativeStat}
                    </StatModifierLabel>
                )}
            </span>
        </NatureViewWrapper>
    );
}
