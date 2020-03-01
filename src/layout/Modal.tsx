/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { makeSingleBorder, mixinAbsoluteFull } from "@pokemmo/styles/variables";
import { useUniqueID } from "@pokemmo/utils";
import { Dialog } from "@reach/dialog";
import React from "react";

interface IProps extends React.ComponentProps<typeof Dialog> {
    title: string;
    actions?: React.ReactNode;
    body: React.ReactNode;
    footer?: React.ReactNode;
    InnerWrap?: React.ComponentType<any>;
}

const paddingX = 24;

export function Modal(_props: IProps) {
    const {
        InnerWrap = "div",
        title,
        actions,
        body,
        footer,
        ...props
    } = _props;
    const titleID = useUniqueID("modalTitle");

    return (
        <Dialog
            {...props}
            css={{
                borderRadius: 9,
                width: "100%",
                maxWidth: 1000,
                marginTop: "10vh",
                marginBottom: "10vh",
                maxHeight: "80vh",
                position: "relative",
                overflow: "hidden",
                padding: 0,
            }}
            aria-labelledby={titleID}
        >
            <InnerWrap>
                <header
                    css={{
                        zIndex: 1,
                        paddingLeft: paddingX,
                        paddingRight: paddingX,
                        height: 56,
                        ...mixinAbsoluteFull(),
                        bottom: "initial",
                        background: "#fff",
                        borderBottom: makeSingleBorder(1),
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <h2
                        tabIndex={-1}
                        id={titleID}
                        css={{ flex: 1, margin: 0, marginRight: 16 }}
                    >
                        {title}
                    </h2>
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
                </header>
                <main
                    css={[
                        {
                            paddingTop: 56 + 16,
                            paddingLeft: paddingX,
                            paddingRight: paddingX,
                            maxHeight: "80vh",
                            overflow: "auto",
                        },
                        footer && {
                            paddingBottom: 56 + 16,
                        },
                    ]}
                >
                    {body}
                </main>
                {footer && (
                    <footer
                        css={{
                            zIndex: 1,
                            height: 56,
                            ...mixinAbsoluteFull(),
                            top: "initial",
                            background: "#fff",
                            borderTop: makeSingleBorder(1),
                            paddingLeft: paddingX,
                            paddingRight: paddingX,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            width: "100%",
                            "& > *": {
                                marginLeft: 16,
                            },
                        }}
                    >
                        {footer}
                    </footer>
                )}
            </InnerWrap>
        </Dialog>
    );
}
