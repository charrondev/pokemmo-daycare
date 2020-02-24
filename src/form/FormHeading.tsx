/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";

interface IProps
    extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "title"> {
    title: React.ReactNode;
    actions?: React.ReactNode;
    description?: React.ReactNode;
}

export function FormHeading(props: IProps) {
    return (
        <div css={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
            <div css={{ flex: 1 }}>
                <h2 tabIndex={0}>{props.title}</h2>
                {props.description && <p>{props.description}</p>}
            </div>
            {props.actions && (
                <div
                    css={{
                        "& > *": {
                            marginLeft: 12,
                        },
                    }}
                >
                    {props.actions}
                </div>
            )}
        </div>
    );
}
