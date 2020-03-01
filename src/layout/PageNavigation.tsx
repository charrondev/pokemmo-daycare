/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import IconPokeball from "@pokemmo/icons/IconPokeball.svg";
import IconPokedex from "@pokemmo/icons/IconPokedex.svg";
import IconProjects from "@pokemmo/icons/IconProjects.svg";
import IconQuestion from "@pokemmo/icons/IconQuestion.svg";
import { AddMenu } from "@pokemmo/layout/AddMenu";
import { colorPrimary, CssType } from "@pokemmo/styles/variables";
import React from "react";
import { NavLink } from "react-router-dom";

const navListStyles: CssType = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    width: "100%",
};

const navListItemStyles: CssType = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0",
};

const navButtonLinkStyles: CssType = {
    appearance: "none",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    borderRadius: 100,
    [`&:focus, &:hover, &[aria-expanded=true]`]: {
        background: "rgba(255, 255, 255, 0.2)",
    },
    "&.focus-visible, &[aria-expanded=true]": {
        boxShadow: "0 0 0 2px #fff",
    },
    "& > svg": {
        height: 46,
    },
};

function PageNavigationLink(props: {
    to: string;
    children: React.ReactNode;
    label?: string;
    className?: string;
}) {
    return (
        <li css={navListItemStyles}>
            <NavLink css={[props.className, navButtonLinkStyles]} to={props.to}>
                {props.children}
            </NavLink>
        </li>
    );
}

export function PageNavigation(props: { className?: string }) {
    return (
        <nav
            css={[
                {
                    background: colorPrimary.string(),
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    padding: "24px 12px",
                },
            ]}
            className={props.className}
        >
            <ul css={navListStyles}>
                <PageNavigationLink label="Home" to="/">
                    <IconPokeball />
                </PageNavigationLink>
                <li css={navListItemStyles}>
                    <AddMenu css={navButtonLinkStyles} />
                </li>
                <PageNavigationLink label="Projects" to="/projects">
                    <IconProjects />
                </PageNavigationLink>
                <PageNavigationLink label="Pokemon" to="/pokemon">
                    <IconPokedex />
                </PageNavigationLink>
            </ul>
            <div css={{ flex: 1 }}></div>
            <ul css={navListStyles}>
                <PageNavigationLink label="Help" to="/help">
                    <IconQuestion />
                </PageNavigationLink>
            </ul>
        </nav>
    );
}
