/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import styled from "@emotion/styled";
import { labelStyle } from "@pokemmo/form/LabelAndValue";
import { nameForStat } from "@pokemmo/pokemon/IVUtils";
import { IVRequirements, Stat } from "@pokemmo/pokemon/PokemonTypes";
import { fontSizeSmall } from "@pokemmo/styles/variables";
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
                maxWidth: `calc(100% + ${statMargin * 2}px)`,
            }}
        >
            {withLabel && (
                <li css={{ listStyle: "none", margin: "8px 4px 0" }}>
                    <label css={labelStyle}>{withLabel}:</label>
                </li>
            )}
            {Object.entries(ivRequirements).map(([stat, data], i) => {
                if (!showEmpties && data?.value === 0) {
                    return <React.Fragment key={i}></React.Fragment>;
                }
                return (
                    <StatView
                        stat={stat as Stat}
                        points={data?.value ?? 31}
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
    padding: 3px 6px;
    border-radius: 4px;
    font-size: ${fontSizeSmall}px;
`;

export function StatView(props: { stat: Stat; points: number }) {
    const color = (() => {
        switch (props.stat) {
            case Stat.HP:
                return "#995D81";
            case Stat.ATTACK:
                return "#FF6872";
            case Stat.DEFENSE:
                return "#6093C9";
            case Stat.SPECIAL_ATTACK:
                return "#BF6167";
            case Stat.SPECIAL_DEFENSE:
                return "#4F7396";
            case Stat.SPEED:
                return "#222D35";
        }
    })();

    return (
        <li css={{ listStyle: "none", margin: "8px 4px 0" }}>
            <Lozenge style={{ backgroundColor: color }}>
                <StatName>{nameForStat(props.stat)} </StatName>
                <StatPoints>{props.points}</StatPoints>
            </Lozenge>
        </li>
    );
}
