/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { CssType } from "@pokemmo/styles/variables";
import React from "react";

export type StyledHTML<T extends HTMLElement> = React.HTMLAttributes<T> & {
    children?: React.ReactNode;
};

export function StyledFactory<
    Tag extends keyof JSX.IntrinsicElements,
    ExtraProps extends object = {}
>(Tag: Tag, css: CssType, displayName?: string) {
    const componentFactory = function(
        props: React.AllHTMLAttributes<any> &
            ExtraProps & { children?: React.ReactNode },
    ) {
        return <Tag {...(props as any)} css={css} />;
    };

    componentFactory.displayName = displayName ?? Tag + "(Unknown)";
    return componentFactory;
}
