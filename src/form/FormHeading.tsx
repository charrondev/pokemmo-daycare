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

export function FormHeading(_props: IProps) {
    const { title, actions, description, ...props } = _props;
    return (
        <div
            {...props}
            css={{ display: "flex", alignItems: "flex-start", width: "100%" }}
        >
            <div css={{ flex: 1 }}>
                <h2>{title}</h2>
                {description && (
                    <p css={{ marginTop: -12, marginBottom: 24 }}>
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div
                    css={{
                        "& > *": {
                            marginLeft: 12,
                        },
                    }}
                >
                    {actions}
                </div>
            )}
        </div>
    );
}
