/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { IVRequirements } from "../utils/IVUtils";

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
            {Object.entries(props.ivRequirements).map(([stat, requirement]) => {
                const value = requirement?.value ?? 31;

                return (
                    <li key={stat} style={{ listStyle: "none", margin: 4 }}>
                        <strong>{stat}:</strong>
                        {value}
                    </li>
                );
            })}
        </ul>
    );
}
