/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import styled from "@emotion/styled";
import { IVRequirements, Stat } from "@pokemmo/pokemon/IVUtils";
export function IVView(props: { ivRequirements: IVRequirements }) {
    return (
        <ul
            style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                padding: 0,
                margin: 0,
            }}
        >
            {props.ivRequirements[Stat.HP] && (
                <StatView
                    stat={Stat.HP}
                    points={props.ivRequirements[Stat.HP]!.value ?? 31}
                />
            )}
            {props.ivRequirements[Stat.ATTACK] && (
                <StatView
                    stat={Stat.ATTACK}
                    points={props.ivRequirements[Stat.ATTACK]!.value ?? 31}
                />
            )}
            {props.ivRequirements[Stat.DEFENSE] && (
                <StatView
                    stat={Stat.DEFENSE}
                    points={props.ivRequirements[Stat.DEFENSE]!.value ?? 31}
                />
            )}
            {props.ivRequirements[Stat.SPECIAL_ATTACK] && (
                <StatView
                    stat={Stat.SPECIAL_ATTACK}
                    points={
                        props.ivRequirements[Stat.SPECIAL_ATTACK]!.value ?? 31
                    }
                />
            )}
            {props.ivRequirements[Stat.SPECIAL_DEFENSE] && (
                <StatView
                    stat={Stat.SPECIAL_DEFENSE}
                    points={
                        props.ivRequirements[Stat.SPECIAL_DEFENSE]!.value ?? 31
                    }
                />
            )}
            {props.ivRequirements[Stat.SPEED] && (
                <StatView
                    stat={Stat.SPEED}
                    points={props.ivRequirements[Stat.SPEED]!.value ?? 31}
                />
            )}
        </ul>
    );
}

const StatName = styled.strong`
    color: white;
`;

const StatPoints = styled.span`
    color: white;
`;

const Lozenge = styled.span`
    display: inline-block;
    height: 24;
`;

function StatView(props: { stat: Stat; points: number }) {
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
        <li style={{ listStyle: "none", margin: 4 }}>
            <Lozenge style={{ backgroundColor: color }}>
                <StatName>{props.stat} </StatName>
                <StatPoints>{props.points}</StatPoints>
            </Lozenge>
        </li>
    );
}
