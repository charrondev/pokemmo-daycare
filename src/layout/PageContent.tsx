/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { boxShadowCard, containerSize } from "@pokemmo/styles/variables";
import { PageContainer } from "@pokemmo/layout/PageContainer";

interface IProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContent(props: IProps) {
    return (
        <div
            className={props.className}
            css={{
                maxWidth: 1500,
                width: "100%",
                height: "100%",
                overflow: "auto",
                boxShadow: boxShadowCard,
            }}
        >
            <main
                css={[
                    {
                        height: "100%",
                        background: "#fff",
                        padding: "32px 0",
                    },
                ]}
            >
                <PageContainer>{props.children}</PageContainer>
            </main>
        </div>
    );
}
