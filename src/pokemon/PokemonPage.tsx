/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormSelectSimple } from "@pokemmo/form/FormSelectSimple";
import {
    PageContainer,
    pageContainerPadding,
} from "@pokemmo/layout/PageContainer";
import { PageLayout } from "@pokemmo/layout/PageLayout";
import {
    DEFAULT_POKEMON_FILTERS,
    PokemonFilters,
} from "@pokemmo/pokemon/PokemonFilters";
import { PokemonGridItem } from "@pokemmo/pokemon/PokemonGridItem";
import {
    useAllPokemon,
    usePokemonActions,
} from "@pokemmo/pokemon/pokemonSlice";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { colorPrimary, fontSizeLarge } from "@pokemmo/styles/variables";
import React, { useState } from "react";

interface IProps {}

const gridItemPadding = 18;

enum PokemonSort {
    NAME = "name",
    EGG_GROUP = "egggroup",
}

export function PokemonPage() {
    const [sortValue, setSortValue] = useState(PokemonSort.NAME);
    const sortedPokemon = useSortedPokemon(sortValue);
    const [selectedPokemon, setSelectedPokemon] = useState<IPokemon[]>([]);
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
                            <div css={{ marginTop: -56 }}></div>
                        </>
                    )}
                    <PokemonSortHeader
                        sortValue={sortValue}
                        onSortValueChange={setSortValue}
                    />
                    <div>
                        {Object.values(sortedPokemon).map(
                            ({ pokemon, title }, i) => {
                                return (
                                    <div key={i}>
                                        <h2
                                            css={{
                                                marginTop: 18,
                                                marginBottom: 0,
                                            }}
                                        >
                                            {title}
                                        </h2>
                                        <PokemonGrid
                                            pokemon={pokemon}
                                            selectedPokemon={selectedPokemon}
                                            setSelectedPokemon={
                                                setSelectedPokemon
                                            }
                                        />
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>
            }
            subNav={
                <PokemonFilters
                    filterValues={DEFAULT_POKEMON_FILTERS}
                    onFilterValuesChange={values => {
                        console.log(values);
                    }}
                />
            }
        />
    );
}

interface ISelectionManager {
    selectedPokemon: IPokemon[];
    setSelectedPokemon: (pokemon: IPokemon[]) => void;
}

function PokemonGrid(props: { pokemon: IPokemon[] } & ISelectionManager) {
    const { selectedPokemon, setSelectedPokemon } = props;

    return (
        <div
            css={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                marginLeft: -gridItemPadding,
                maxWidth: `calc(100% + ${gridItemPadding * 2}px)`,
            }}
        >
            {props.pokemon.map(pokemon => {
                return (
                    <PokemonGridItem
                        css={{
                            margin: gridItemPadding,
                            minWidth: 300,
                        }}
                        pokemon={pokemon}
                        key={pokemon.id}
                        isSelected={selectedPokemon.includes(pokemon)}
                        onClick={() => {
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
                );
            })}
        </div>
    );
}

function PokemonSortHeader(props: {
    sortValue: PokemonSort;
    onSortValueChange: (newSort: PokemonSort) => void;
}) {
    return (
        <header
            css={{
                marginTop: -pageContainerPadding,
                marginLeft: -pageContainerPadding,
                height: 56,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: `calc(100% + ${pageContainerPadding * 2}px)`,
                position: "sticky",
                top: 0,
                zIndex: 1,
            }}
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
                marginTop: -pageContainerPadding,
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
                                    pokemonID: pokemon.id,
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

type ISortedPokemon = Record<
    string,
    {
        title: string;
        pokemon: IPokemon[];
    }
>;

function useSortedPokemon(sortValue: PokemonSort): ISortedPokemon {
    const allPokemon = useAllPokemon();

    switch (sortValue) {
        case PokemonSort.EGG_GROUP: {
            const pokemonByEggGroup: ISortedPokemon = {};
            Object.values(allPokemon).forEach(pokemon => {
                const dexMon = getPokemon(pokemon.identifier);
                if (!dexMon) {
                    return;
                }
                const existingEgg1 = pokemonByEggGroup[dexMon.eggGroup1] ?? {
                    title: dexMon.eggGroup1,
                    pokemon: [],
                };
                existingEgg1.pokemon.push(pokemon);
                pokemonByEggGroup[dexMon.eggGroup1] = existingEgg1;

                if (dexMon.eggGroup2) {
                    const existingEgg2 = pokemonByEggGroup[
                        dexMon.eggGroup2
                    ] ?? {
                        title: dexMon.eggGroup2,
                        pokemon: [],
                    };
                    existingEgg2.pokemon.push(pokemon);
                    pokemonByEggGroup[dexMon.eggGroup2] = existingEgg2;
                }
            });
            return sortObjectByKey(pokemonByEggGroup);
        }
        case PokemonSort.NAME:
        default: {
            const pokemonByName: ISortedPokemon = {};
            Object.values(allPokemon).forEach(pokemon => {
                const dexMon = getPokemon(pokemon.identifier);
                if (!dexMon) {
                    return;
                }
                const existingByName = pokemonByName[pokemon.identifier] ?? {
                    title: dexMon.displayName,
                    pokemon: [],
                };
                existingByName.pokemon.push(pokemon);
                pokemonByName[pokemon.identifier] = existingByName;
            });
            return sortObjectByKey(pokemonByName);
        }
    }
}

function sortObjectByKey<T extends object>(object: T): T {
    const result: T = {} as T;
    Object.keys(object)
        .sort()
        .forEach(key => {
            (result as any)[key] = (object as any)[key] as any;
        });
    return result;
}
