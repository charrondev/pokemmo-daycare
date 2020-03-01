/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { PageContent } from "@pokemmo/layout/PageContent";
import { PageNavigation } from "@pokemmo/layout/PageNavigation";
import { PageSubNavigation } from "@pokemmo/layout/PageSubNavigation";
import React from "react";

interface IProps {
    content: React.ReactNode;
    subNav?: React.ReactNode;
}

const pageNavWidth = 66;
const pageSubNavWidth = 340;

export function PageLayout(props: IProps) {
    return (
        <>
            <div
                css={{
                    height: "100%",
                    minHeight: "100%",
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: pageNavWidth,
                    paddingRight: pageNavWidth,
                    width: "100%",

                    // Alignment
                    display: "flex",
                    alignItems: "stretch",
                }}
            >
                <PageContent
                    css={{
                        height: "100%",
                        position: "relative",
                        zIndex: 1,
                        order: 1,
                        margin: "0 auto",
                        [`@media (min-width: ${1300 +
                            pageNavWidth +
                            pageSubNavWidth}px)`]: {
                            flex: 1,
                            minWidth: 1300 - pageNavWidth - pageSubNavWidth,
                        },
                    }}
                >
                    {props.content}
                </PageContent>
                {props.subNav && (
                    <PageSubNavigation
                        css={{
                            minWidth: pageSubNavWidth,
                            maxWidth: 500,
                            height: "100%",
                            order: 0,
                            flex: 1,
                        }}
                    >
                        {props.subNav}
                    </PageSubNavigation>
                )}
            </div>
            <PageNavigation
                css={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    width: pageNavWidth,
                }}
            />
        </>
    );
}
