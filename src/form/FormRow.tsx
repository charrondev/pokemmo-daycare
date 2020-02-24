/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";

export function FormRow(
    props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
    return (
        <div
            {...props}
            css={{
                display: "flex",
                flexWrap: "wrap",
                "& > *": {
                    flex: 1,
                    minWidth: 400,
                    marginRight: 32,
                },
                "& > *:last-child": {
                    marginRight: 0,
                },
            }}
        />
    );
}
