/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { Checkbox } from "@atlaskit/checkbox";
import TableTree, {
    Cell,
    Header,
    Headers,
    Row,
    Rows,
} from "@atlaskit/table-tree";
import React, { useState } from "react";
import styled from "styled-components";
import { PokemonType } from "../utils/Pokemon";
import { IVView } from "./IVView";
import { getPokemon } from "./pokedex";

interface IPokemonTreeItem {
    pokemon: PokemonType;
    children: IPokemonTreeItem[];
}

function mapPokemonToTree(pokemon: PokemonType): IPokemonTreeItem {
    return {
        pokemon,
        children: pokemon.parents
            ? Object.values(pokemon.parents).map(mapPokemonToTree)
            : [],
    };
}

const TitleCell = styled.span`
    display: flex;
    align-items: center;
`;

const TableStyler = styled.div`
    & [role="gridcell"]:first-child {
        // display: flex;
        // justify-content: flex-end;

        // & > *:first-child {
        //     margin-right: auto;
        // }
    }
`;

export function PokemonTree(props: { pokemon: PokemonType }) {
    const [expandedIDs, setExpandedIDs] = useState<{
        [uuid: string]: boolean;
    }>({});
    const treeData = [mapPokemonToTree(props.pokemon)];

    return (
        <TableStyler>
            <TableTree>
                <Headers>
                    <Header width={"20%"} style={{ flex: 1 }}>
                        Pokemon
                    </Header>
                    <Header width={80}>Gender</Header>
                    <Header width={400}>Stats</Header>
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
                                isDefaultExpanded={true}
                                itemId={pokemon.uuid}
                                items={children}
                                hasChildren={children.length > 0}
                                isExpanded={expandedIDs[pokemon.uuid]}
                                onExpand={() =>
                                    setExpandedIDs({
                                        [pokemon.uuid]: true,
                                    })
                                }
                                onCollapse={() =>
                                    setExpandedIDs({
                                        [pokemon.uuid]: false,
                                    })
                                }
                            >
                                <Cell width={"20%"} style={{ flex: 1 }}>
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
        </TableStyler>
    );
}
