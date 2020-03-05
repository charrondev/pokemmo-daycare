/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { getPokemon } from "@pokemmo/data/pokedex";
import { GridLayout, GridSection } from "@pokemmo/layout/GridLayout";
import {
    filterPokemon,
    IPokemonFilters,
} from "@pokemmo/pokemon/PokemonFilters";
import { PokemonGridItem } from "@pokemmo/pokemon/PokemonGridItem";
import { useAllPokemon } from "@pokemmo/pokemon/pokemonHooks";
import { IPokemon } from "@pokemmo/pokemon/PokemonTypes";
import { fontSizeTitle } from "@pokemmo/styles/variables";
import React from "react";

export enum PokemonSort {
    NAME = "name",
    EGG_GROUP = "egggroup",
}

interface IProps {
    sort: PokemonSort;
    filters: IPokemonFilters;
    selectedPokemon: IPokemon[];
    onPokemonSelected: (pokemon: IPokemon) => void;
}

export function PokemonGrid(props: IProps) {
    const { sort, filters, selectedPokemon, onPokemonSelected } = props;
    const sortedPokemon = useSortedPokemon(sort, filters);
    const pokemonCount = Object.values(sortedPokemon).flat().length;

    if (pokemonCount === 0) {
        return (
            <div css={{ paddingTop: 18, paddingBottom: 18 }}>No Pokemon</div>
        );
    }

    return (
        <GridLayout>
            {Object.values(sortedPokemon).map(
                ({ pokemon: pokemonGroups, title }, i) => {
                    return (
                        <React.Fragment key={i}>
                            <GridSection
                                css={{ fontSize: fontSizeTitle }}
                                title={title}
                                key={i}
                            >
                                {pokemonGroups.map(pokemon => {
                                    return (
                                        <PokemonGridItem
                                            css={{
                                                margin: 18,
                                                minWidth: 300,
                                            }}
                                            pokemon={pokemon}
                                            key={pokemon.id}
                                            isSelected={selectedPokemon.includes(
                                                pokemon,
                                            )}
                                            onClick={() => {
                                                onPokemonSelected(pokemon);
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === " ") {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onPokemonSelected(pokemon);
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </GridSection>
                        </React.Fragment>
                    );
                },
            )}
        </GridLayout>
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
