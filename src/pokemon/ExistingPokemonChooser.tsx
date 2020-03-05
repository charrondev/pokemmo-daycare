/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { Modal } from "@pokemmo/layout/Modal";
import { IPokemonFilters } from "@pokemmo/pokemon/PokemonFilters";
import { PokemonGrid, PokemonSort } from "@pokemmo/pokemon/PokemonGrid";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { notEmpty } from "@pokemmo/utils";
import React, { useState } from "react";

interface IProps {
    filters: IPokemonFilters;
    onDismiss: () => void;
    onSelect: (pokemon: IPokemon) => void;
}

export function ExistingPokemonChooser(props: IProps) {
    const [selectedPokemon, setSelectedPokemon] = useState<IPokemon | null>(
        null,
    );
    return (
        <Modal
            title="Choose Existing Pokemon"
            onDismiss={props.onDismiss}
            footer={
                <>
                    <FormButton
                        onClick={() => {
                            props.onDismiss?.();
                        }}
                    >
                        Close
                    </FormButton>
                    <FormButton
                        disabled={!selectedPokemon}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => {
                            if (selectedPokemon) {
                                props.onSelect(selectedPokemon);
                                props.onDismiss();
                            }
                        }}
                    >
                        Select
                    </FormButton>
                </>
            }
            body={
                <PokemonGrid
                    filters={props.filters}
                    sort={PokemonSort.NAME}
                    selectedPokemon={[selectedPokemon].filter(notEmpty)}
                    onPokemonSelected={setSelectedPokemon}
                />
            }
        />
    );
}
