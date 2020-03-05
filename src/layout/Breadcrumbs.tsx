/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { mixinExtendContainer } from "@pokemmo/styles/variables";
import React from "react";
import { NavLink, useHistory } from "react-router-dom";

interface IProps {
    crumbs: {
        name: string;
        href: string;
        icon?: React.ReactNode;
    }[];
    separator?: string;
}

export function Breadcrumbs(props: IProps) {
    const { location } = useHistory();
    const { crumbs, separator = "/" } = props;

    return (
        <nav
            aria-label="breadcrumbs"
            css={{
                display: "flex",
                alignItems: "center",
                ...mixinExtendContainer(12),
                marginBottom: 24,
            }}
        >
            {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;

                return (
                    <React.Fragment key={i}>
                        <NavLink
                            css={{
                                padding: 12,
                                fontWeight: 500,
                            }}
                            aria-current={
                                crumb.href === location.pathname
                                    ? "page"
                                    : undefined
                            }
                            to={crumb.href}
                        >
                            {crumb.icon}
                            {crumb.name}
                        </NavLink>
                        {!isLast && <span>{separator}</span>}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
