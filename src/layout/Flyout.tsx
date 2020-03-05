/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { css } from "@emotion/core";
import {
    buttonCommonCSS,
    ButtonType,
    cssForButtonType,
} from "@pokemmo/form/FormButton";
import {
    borderRadius,
    fontSizeLarge,
    makeSingleBorder,
} from "@pokemmo/styles/variables";
import { Menu, MenuButton, MenuItems, MenuPopover } from "@reach/menu-button";
import { Position } from "@reach/popover";
import React from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType?: ButtonType;
    buttonContent: React.ReactNode;
    items: React.ReactNode;
    scrim?: React.ReactNode;
    position?: Position;
}

const menuItemStyles = css({
    padding: "9px 18px",
    "&:hover, &:active, &:focus": {
        background: "#E7EAFF",
        color: "inherit",
    },
});

export function Flyout(_props: IProps) {
    const {
        buttonType,
        buttonContent,
        scrim,
        items,
        position,
        ...props
    } = _props;
    return (
        <Menu>
            <MenuButton
                {...props}
                css={
                    buttonType
                        ? [cssForButtonType(buttonType), buttonCommonCSS]
                        : null
                }
            >
                {buttonContent}
            </MenuButton>
            <MenuPopover position={position}>
                {scrim}
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
                        "& > *": menuItemStyles,
                    }}
                >
                    {items}
                </MenuItems>
            </MenuPopover>
        </Menu>
    );
}
