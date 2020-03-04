/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import styled from "@emotion/styled";
import { labelStyle } from "@pokemmo/form/LabelAndValue";
import { nameForStat } from "@pokemmo/pokemon/IVUtils";
import { IVRequirements, Stat } from "@pokemmo/pokemon/PokemonTypes";
import Color from "color";
import React from "react";

const statMargin = 4;

interface IProps extends React.OlHTMLAttributes<HTMLUListElement> {
    ivRequirements: IVRequirements;
    withLabel?: string;
    showEmpties?: boolean;
}

export function IVView(_props: IProps) {
    const { ivRequirements, withLabel, showEmpties, ...props } = _props;
    return (
        <ul
            {...props}
            css={{
                display: "inline-flex",
                flexWrap: "wrap",
                alignItems: "center",
                padding: 0,
                margin: 0,
                marginLeft: -statMargin,
                marginBottom: -statMargin,
                marginTop: -statMargin,
                maxWidth: `calc(100% + ${statMargin * 2}px)`,
            }}
        >
            {withLabel && (
                <li css={{ listStyle: "none", margin: "8px 4px" }}>
                    <label css={labelStyle}>{withLabel}:</label>
                </li>
            )}
            {Object.entries(ivRequirements).map(([stat, data], i) => {
                if (
                    !showEmpties &&
                    (data?.value === 0 || data?.value == null)
                ) {
                    return <React.Fragment key={i}></React.Fragment>;
                }
                return (
                    <StatView
                        stat={stat as Stat}
                        points={data?.value}
                        key={i}
                    />
                );
            })}
        </ul>
    );
}

const StatName = styled.strong`
    color: white;
    font-weight: bold;
    margin-right: 3px;
`;

const StatPoints = styled.span`
    color: white;
    font-weight: bold;
`;

const Lozenge = styled.span`
    display: inline-flex;
    height: 24;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: ${11}px;
`;

export const colorForStat = (stat: Stat | null): Color | null => {
    switch (stat) {
        case Stat.HP:
            return Color("#995D81");
        case Stat.ATTACK:
            return Color("#FF6872");
        case Stat.DEFENSE:
            return Color("#6093C9");
        case Stat.SPECIAL_ATTACK:
            return Color("#BF6167");
        case Stat.SPECIAL_DEFENSE:
            return Color("#4F7396");
        case Stat.SPEED:
            return Color("#222D35");
        default:
            return null;
    }
};

export function StatView(props: { stat: Stat; points: number }) {
    const statColor = colorForStat(props.stat);
    return (
        <li
            css={{
                listStyle: "none",
                margin: "8px 4px",
                display: "inline-block",
            }}
        >
            <Lozenge style={{ backgroundColor: statColor?.toString() }}>
                <StatName>{nameForStat(props.stat)} </StatName>
                <StatPoints>{props.points}</StatPoints>
            </Lozenge>
        </li>
    );
}
