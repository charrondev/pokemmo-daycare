/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { PageContainer } from "@pokemmo/layout/PageContainer";
import { boxShadowCard } from "@pokemmo/styles/variables";
import { EMPTY_RECT, useMeasure } from "@pokemmo/utils";
import React, { useContext, useRef } from "react";

interface IProps {
    children: React.ReactNode;
    className?: string;
}

const PageContentSizeContext = React.createContext<DOMRect>(EMPTY_RECT);

export function usePageContentSize() {
    return useContext(PageContentSizeContext);
}

export function PageContent(props: IProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const measure = useMeasure(ref);

    return (
        <PageContentSizeContext.Provider value={measure}>
            <div
                ref={ref}
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
        </PageContentSizeContext.Provider>
    );
}
