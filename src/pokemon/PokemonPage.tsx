/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { FormSelectSimple } from "@pokemmo/form/FormSelectSimple";
import { GridLayout, GridSection } from "@pokemmo/layout/GridLayout";
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
import { PokemonGridItem } from "@pokemmo/pokemon/PokemonGridItem";
import {
    useAllPokemon,
    usePokemonActions,
} from "@pokemmo/pokemon/pokemonHooks";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import {
    colorPrimary,
    fontSizeLarge,
    fontSizeTitle,
} from "@pokemmo/styles/variables";
import { useQueryParamsSync } from "@pokemmo/utils";
import queryString from "query-string";
import React, { useState } from "react";

interface IProps {}

const gridItemPadding = 18;

enum PokemonSort {
    NAME = "name",
    EGG_GROUP = "egggroup",
}

export function PokemonPage() {
    const [sortValue, setSortValue] = useState(PokemonSort.NAME);
    const [filters, setFilters] = useState<IPokemonFilters>({
        ...DEFAULT_POKEMON_FILTERS,
        ...queryString.parse(window.location.search),
    });

    useQueryParamsSync(filters, DEFAULT_POKEMON_FILTERS);

    const sortedPokemon = useSortedPokemon(sortValue, filters);
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
                    <GridLayout>
                        {Object.values(sortedPokemon).map(
                            ({ pokemon, title }, i) => {
                                return (
                                    <React.Fragment>
                                        <GridSection
                                            css={{ fontSize: fontSizeTitle }}
                                            title={title}
                                            key={i}
                                        >
                                            <PokemonGridItems
                                                pokemon={pokemon}
                                                selectedPokemon={
                                                    selectedPokemon
                                                }
                                                setSelectedPokemon={
                                                    setSelectedPokemon
                                                }
                                            />
                                        </GridSection>
                                    </React.Fragment>
                                );
                            },
                        )}
                    </GridLayout>
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

interface ISelectionManager {
    selectedPokemon: IPokemon[];
    setSelectedPokemon: (pokemon: IPokemon[]) => void;
}

function PokemonGridItems(props: { pokemon: IPokemon[] } & ISelectionManager) {
    const { selectedPokemon, setSelectedPokemon } = props;

    return (
        <>
            {props.pokemon.map(pokemon => {
                const handleClick = () => {
                    if (selectedPokemon.includes(pokemon)) {
                        setSelectedPokemon(
                            selectedPokemon.filter(
                                selected => selected !== pokemon,
                            ),
                        );
                    } else {
                        setSelectedPokemon([...selectedPokemon, pokemon]);
                    }
                };
                return (
                    <PokemonGridItem
                        css={{
                            margin: gridItemPadding,
                            minWidth: 300,
                        }}
                        pokemon={pokemon}
                        key={pokemon.id}
                        isSelected={selectedPokemon.includes(pokemon)}
                        onClick={handleClick}
                        onKeyDown={e => {
                            if (e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                handleClick();
                            }
                        }}
                    />
                );
            })}
        </>
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

type ISortedPokemon = Record<
    string,
    {
        title: string;
        pokemon: IPokemon[];
    }
>;

function useSortedPokemon(
    sortValue: PokemonSort,
    filters: IPokemonFilters,
): ISortedPokemon {
    const allPokemonByID = useAllPokemon();
    const allPokemon = filterPokemon(Object.values(allPokemonByID), filters);

    // Apply sorting

    switch (sortValue) {
        case PokemonSort.EGG_GROUP: {
            const pokemonByEggGroup: ISortedPokemon = {};
            allPokemon.forEach(pokemon => {
                const dexMon = getPokemon(pokemon.identifier);
                if (!dexMon) {
                    return;
                }

                if (
                    !filters.eggGroups ||
                    filters.eggGroups.length === 0 ||
                    filters.eggGroups.includes(dexMon.eggGroup1)
                ) {
                    const existingEgg1 = pokemonByEggGroup[
                        dexMon.eggGroup1
                    ] ?? {
                        title: dexMon.eggGroup1,
                        pokemon: [],
                    };

                    existingEgg1.pokemon.push(pokemon);
                    pokemonByEggGroup[dexMon.eggGroup1] = existingEgg1;
                }

                if (dexMon.eggGroup2) {
                    if (
                        !filters.eggGroups ||
                        filters.eggGroups.length === 0 ||
                        filters.eggGroups.includes(dexMon.eggGroup2)
                    ) {
                        const existingEgg2 = pokemonByEggGroup[
                            dexMon.eggGroup2
                        ] ?? {
                            title: dexMon.eggGroup2,
                            pokemon: [],
                        };
                        existingEgg2.pokemon.push(pokemon);
                        pokemonByEggGroup[dexMon.eggGroup2] = existingEgg2;
                    }
                }
            });
            return sortObjectByKey(pokemonByEggGroup);
        }
        case PokemonSort.NAME:
        default: {
            const pokemonByName: ISortedPokemon = {};
            allPokemon.forEach(pokemon => {
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
