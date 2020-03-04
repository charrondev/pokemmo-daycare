/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { mixinExtendContainer } from "@pokemmo/styles/variables";
import React from "react";

interface IProps {
    children?: React.ReactNode;
    className?: string;
    minItemWidth?: number;
    gutter?: number;
}

export function GridLayout(props: IProps) {
    const { minItemWidth = 320, gutter = 18 } = props;
    return (
        <div
            className={props.className}
            css={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
                gridAutoColumns: "max-content",
                display: "grid",
                ...mixinExtendContainer(gutter),
                marginBottom: gutter,
            }}
        >
            {props.children}
        </div>
    );
}

export function GridSection(props: {
    className?: string;
    children?: React.ReactNode;
    title: string;
    gutter?: number;
}) {
    const { gutter = 18 } = props;
    return (
        <>
            <h4
                className={props.className}
                css={{
                    gridColumn: "1 / -1",
                    marginBottom: 0,
                    marginTop: gutter,
                    paddingLeft: gutter,
                    paddingRight: gutter,
                }}
            >
                {props.title}
            </h4>
            {props.children}
        </>
    );
}

export function GridEmptyLabel(props: {
    className?: string;
    children?: React.ReactNode;
    gutter?: number;
}) {
    const { gutter = 18 } = props;
    return (
        <div
            className={props.className}
            css={{
                gridColumn: "1 / -1",
                marginBottom: 0,
                marginTop: gutter,
                paddingLeft: gutter,
                paddingRight: gutter,
            }}
        >
            {props.children}
        </div>
    );
}
