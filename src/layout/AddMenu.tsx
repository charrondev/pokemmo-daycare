/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { css } from "@emotion/core";
import IconAdd from "@pokemmo/icons/IconAdd.svg";
import { PokemonForm } from "@pokemmo/pokemon/PokemonForm";
import { ProjectForm } from "@pokemmo/projects/ProjectForm";
import {
    borderRadius,
    fontSizeLarge,
    makeSingleBorder,
} from "@pokemmo/styles/variables";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    MenuPopover,
} from "@reach/menu-button";
import React, { useState } from "react";

interface IProps {
    className?: string;
}

const menuItemStyles = css({
    padding: "9px 18px",
    "&:hover, &:active, &:focus": {
        background: "#E7EAFF",
        color: "inherit",
    },
});

export function AddMenu(props: IProps) {
    const [showPokemonModal, setShowPokemonModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);

    return (
        <>
            <Menu>
                <MenuButton className={props.className}>
                    <IconAdd />
                </MenuButton>
                <MenuPopover
                    position={(targetRect, ownRect) => {
                        return {
                            left: targetRect!.right + 9,
                            top: targetRect?.top,
                            width: ownRect?.width,
                            minWidth: 160,
                        };
                    }}
                >
                    <div
                        css={{
                            position: "fixed",
                            top: 0,
                            bottom: 0,
                            left: 66,
                            right: 0,
                            background: "rgba(0, 0, 0, 0.2)",
                        }}
                    ></div>
                    <MenuItems
                        css={{
                            position: "relative",
                            zIndex: 1,
                            padding: "9px 0",
                            border: makeSingleBorder(1),
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            borderRadius: borderRadius,
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            fontSize: fontSizeLarge,
                        }}
                    >
                        <MenuItem
                            onSelect={() => setShowProjectModal(true)}
                            css={menuItemStyles}
                        >
                            Add Project
                        </MenuItem>
                        <MenuItem
                            onSelect={() => setShowPokemonModal(true)}
                            css={menuItemStyles}
                        >
                            Add Pokemon
                        </MenuItem>
                    </MenuItems>
                </MenuPopover>
            </Menu>
            {showPokemonModal && (
                <PokemonForm onDismiss={() => setShowPokemonModal(false)} />
            )}
            {showProjectModal && (
                <ProjectForm onDismiss={() => setShowProjectModal(false)} />
            )}
        </>
    );
}
