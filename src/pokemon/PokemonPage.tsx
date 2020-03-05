/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormSelectSimple } from "@pokemmo/form/FormSelectSimple";
import {
    PageContainer,
    pageContainerPadding,
} from "@pokemmo/layout/PageContainer";
import { PageLayout } from "@pokemmo/layout/PageLayout";
import {
    DEFAULT_POKEMON_FILTERS,
    filterPokemon,
    IPokemonFilters,
    PokemonFilters,
} from "@pokemmo/pokemon/PokemonFilters";
import { PokemonGrid, PokemonSort } from "@pokemmo/pokemon/PokemonGrid";
import { usePokemonActions } from "@pokemmo/pokemon/pokemonHooks";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { colorPrimary, fontSizeLarge } from "@pokemmo/styles/variables";
import { useQueryParamsSync } from "@pokemmo/utils";
import queryString from "query-string";
import React, { useState } from "react";

export function PokemonPage() {
    const [sortValue, setSortValue] = useState(PokemonSort.NAME);
    const [filters, setFilters] = useState<IPokemonFilters>({
        ...DEFAULT_POKEMON_FILTERS,
        ...queryString.parse(window.location.search),
    });

    useQueryParamsSync(filters, DEFAULT_POKEMON_FILTERS);

    const [_selectedPokemon, setSelectedPokemon] = useState<IPokemon[]>([]);
    const selectedPokemon = filterPokemon(_selectedPokemon, filters);

    return (
        <PageLayout
            content={
                <div>
                    {selectedPokemon.length > 0 && (
                        <>
                            <PokemonActionHeader
                                setSelectedPokemon={setSelectedPokemon}
                                selectedPokemon={selectedPokemon}
                            />
                            <div css={{ marginTop: -20 }}></div>
                        </>
                    )}
                    <PokemonSortHeader
                        isHidden={selectedPokemon.length > 0}
                        sortValue={sortValue}
                        onSortValueChange={setSortValue}
                    />
                    <PokemonGrid
                        sort={sortValue}
                        filters={filters}
                        selectedPokemon={selectedPokemon}
                        onPokemonSelected={pokemon => {
                            if (selectedPokemon.includes(pokemon)) {
                                setSelectedPokemon(
                                    selectedPokemon.filter(
                                        selected => selected !== pokemon,
                                    ),
                                );
                            } else {
                                setSelectedPokemon([
                                    ...selectedPokemon,
                                    pokemon,
                                ]);
                            }
                        }}
                    />
                </div>
            }
            subNav={
                <PokemonFilters
                    filterValues={filters}
                    onFilterValuesChange={setFilters}
                />
            }
        />
    );
}

function PokemonSortHeader(props: {
    isHidden?: boolean;
    sortValue: PokemonSort;
    onSortValueChange: (newSort: PokemonSort) => void;
}) {
    return (
        <header
            css={[
                {
                    marginTop: -10,
                    marginLeft: -pageContainerPadding,
                    height: 56,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: `calc(100% + ${pageContainerPadding * 2}px)`,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                },
                props.isHidden && {
                    opacity: 0,
                    pointerEvents: "none",
                },
            ]}
        >
            <PageContainer css={{ display: "flex", alignItems: "center" }}>
                <FormSelectSimple
                    label="Sort By"
                    options={[
                        {
                            label: "Name",
                            value: PokemonSort.NAME,
                        },
                        {
                            label: "Egg Group",
                            value: PokemonSort.EGG_GROUP,
                        },
                    ]}
                    value={props.sortValue}
                    onChange={newValue => {
                        props.onSortValueChange(newValue as PokemonSort);
                    }}
                />
            </PageContainer>
        </header>
    );
}

function PokemonActionHeader(props: {
    selectedPokemon: IPokemon[];
    setSelectedPokemon: (pokemon: IPokemon[]) => void;
}) {
    const { selectedPokemon, setSelectedPokemon } = props;
    const { deletePokemon } = usePokemonActions();

    return (
        <header
            css={{
                background: colorPrimary.string(),
                color: "#fff",
                marginTop: -46,
                marginLeft: -pageContainerPadding,
                height: 56,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: `calc(100% + ${pageContainerPadding * 2}px)`,
                position: "sticky",
                top: 0,
                zIndex: 2,
            }}
        >
            <PageContainer css={{ display: "flex", alignItems: "center" }}>
                <div
                    css={{
                        fontWeight: "bold",
                        fontSize: fontSizeLarge,
                        flex: 1,
                    }}
                >
                    {selectedPokemon.length} Selected
                </div>
                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <FormButton
                        buttonType={ButtonType.TRANSLUSCENT}
                        onClick={() => {
                            setSelectedPokemon([]);
                        }}
                    >
                        Clear
                    </FormButton>
                    <FormButton
                        buttonType={ButtonType.TRANSLUSCENT}
                        css={{ marginLeft: 12 }}
                        onClick={() => {
                            selectedPokemon.forEach(pokemon => {
                                deletePokemon({
                                    pokemon,
                                });
                            });
                            setSelectedPokemon([]);
                        }}
                    >
                        Delete
                    </FormButton>
                </div>
            </PageContainer>
        </header>
    );
}
