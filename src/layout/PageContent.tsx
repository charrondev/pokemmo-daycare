/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { PageContainer } from "@pokemmo/layout/PageContainer";
import { boxShadowCard } from "@pokemmo/styles/variables";
import React from "react";

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
                minHeight: "100%",
                overflow: "auto",
                boxShadow: boxShadowCard,
            }}
        >
            <main
                css={[
                    {
                        minHeight: "100%",
                        background: "#fff",
                        padding: "32px 0",
                        paddingTop: 46,
                    },
                ]}
            >
                <PageContainer>{props.children}</PageContainer>
            </main>
        </div>
    );
}
