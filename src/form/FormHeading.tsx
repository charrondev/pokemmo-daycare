/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import React from "react";

interface IProps
    extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "title"> {
    title: React.ReactNode;
    actions?: React.ReactNode;
    description?: React.ReactNode;
    asElement?: "h2" | "h3" | "h4" | "h5";
}

export function FormHeading(_props: IProps) {
    const { title, actions, description, asElement = "h2", ...props } = _props;
    const HeadingElement = asElement;
    return (
        <div
            {...props}
            css={{ display: "flex", alignItems: "flex-start", width: "100%" }}
        >
            <div css={{ flex: 1 }}>
                <HeadingElement>{title}</HeadingElement>
                {description && (
                    <p
                        css={{
                            maxWidth: 700,
                            marginTop: -12,
                            marginBottom: 24,
                            lineHeight: 1.4,
                        }}
                    >
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
