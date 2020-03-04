/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import styled from "@emotion/styled";
import { getNature } from "@pokemmo/pokemon/natures";
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
    nature: string | null;
    isVertical?: boolean;
}) {
    const fullNature = getNature(props.nature);
    return (
        <NatureViewWrapper isVertical={props.isVertical}>
            <span className="natureName">{fullNature?.name}</span>
            <span>
                {fullNature?.positiveStat && (
                    <StatModifierLabel>
                        +{fullNature.positiveStat}
                    </StatModifierLabel>
                )}
                {fullNature?.negativeStat && (
                    <StatModifierLabel>
                        -{fullNature.negativeStat}
                    </StatModifierLabel>
                )}
            </span>
        </NatureViewWrapper>
    );
}
