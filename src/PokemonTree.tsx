/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React, { useState } from "react";
import TableTree, {
    Headers,
    Header,
    Rows,
    Row,
    Cell
} from "@atlaskit/table-tree";
import { Pokemon } from "./calculator/Pokemon";
import { IVRequirements } from "./calculator/IVUtils";
import { getPokemon } from "./pokedex";
import styled from "styled-components";
import { Checkbox } from "@atlaskit/checkbox";

interface IPokemonTreeItem {
    pokemon: Pokemon;
    children: IPokemonTreeItem[];
}

function mapPokemonToTree(pokemon: Pokemon): IPokemonTreeItem {
    return {
        pokemon,
        children: pokemon.parents
            ? Object.values(pokemon.parents).map(mapPokemonToTree)
            : []
    };
}

const TitleCell = styled.span`
    display: flex;
    align-items: center;
`;

export function PokemonTree(props: { pokemon: Pokemon }) {
    const [expandedIDs, setExpandedIDs] = useState<{
        [uuid: string]: boolean;
    }>({});
    const treeData = [mapPokemonToTree(props.pokemon)];

    return (
        <TableTree>
            <Headers>
                <Header width={200}>Pokemon</Header>
                <Header width={80}>Gender</Header>
                <Header width={600}>Stats</Header>
                <Header width={100}>Complete</Header>
            </Headers>
            <Rows
                items={treeData}
                render={({ pokemon, children }: IPokemonTreeItem) => {
                    if (!pokemon) {
                        return null;
                    }
                    const pokeDexMon = getPokemon(pokemon.name)!;

                    return (
                        <Row
                            itemId={pokemon.uuid}
                            items={children}
                            hasChildren={children.length > 0}
                            isExpanded={expandedIDs[pokemon.uuid]}
                            onExpand={() =>
                                setExpandedIDs({
                                    [pokemon.uuid]: true
                                })
                            }
                            onCollapse={() =>
                                setExpandedIDs({
                                    [pokemon.uuid]: false
                                })
                            }
                        >
                            <Cell singleLine>
                                <TitleCell>
                                    <img
                                        src={pokeDexMon.sprites.normal}
                                        height={24}
                                        width={24}
                                        alt={""}
                                    />
                                    {pokemon.name}
                                </TitleCell>
                            </Cell>
                            <Cell>
                                <em>{pokemon.gender}</em>
                            </Cell>
                            <Cell>
                                <IVView
                                    ivRequirements={pokemon.ivRequirements}
                                />
                            </Cell>
                            <Cell>
                                <Checkbox />
                            </Cell>
                        </Row>
                    );
                }}
            />
        </TableTree>
    );
}

function IVView(props: { ivRequirements: IVRequirements }) {
    return (
        <ul
            style={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: 0
            }}
        >
            {Object.entries(props.ivRequirements).map(([stat, requirement]) => {
                const value = requirement?.value ?? 31;

                return (
                    <li key={stat} style={{ listStyle: "none", margin: 4 }}>
                        <strong>{stat}:</strong>
                        {value}
                    </li>
                );
            })}
        </ul>
    );
}
