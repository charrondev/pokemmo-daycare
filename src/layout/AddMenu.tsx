/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React, { useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@reach/menu-button";
import IconAdd from "@pokemmo/icons/IconAdd.svg";
import { PokemonForm } from "@pokemmo/pokemon/PokemonForm";

interface IProps {
    className?: string;
}

export function AddMenu(props: IProps) {
    const [showPokemonModal, setShowPokemonModal] = useState(false);

    return (
        <>
            <Menu>
                <MenuButton className={props.className}>
                    <IconAdd />
                </MenuButton>
                <MenuList>
                    <MenuItem onSelect={() => alert("Add project")}>
                        Add Project
                    </MenuItem>
                    <MenuItem onSelect={() => setShowPokemonModal(true)}>
                        Add Pokemon
                    </MenuItem>
                </MenuList>
            </Menu>
            {showPokemonModal && (
                <PokemonForm
                    asModal
                    onDismiss={() => setShowPokemonModal(false)}
                />
            )}
        </>
    );
}
