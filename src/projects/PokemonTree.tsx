// /**
//  * @copyright 2020 Adam (charrondev) Charron
//  * @license GPL-3.0-only
//  */

// import { Checkbox } from "@atlaskit/checkbox";
// import TableTree, {
//     Cell,
//     Header,
//     Headers,
//     Row,
//     Rows,
// } from "@atlaskit/table-tree";
import React from "react";
// import styled from "@emotion/styled";
// import { PokemonType, PokemonStatus } from "@pokemmo/pokemon/PokemonFactory";
// import {
//     PokemonByID,
//     useAllPokemon,
//     usePokemonActions,
// } from "@pokemmo/pokemon/pokemonSlice";
// import {
//     useProject,
//     useProjectPokemon,
//     useProjectActions,
// } from "@pokemmo/projects/projectsSlice";
// import { PokemonName } from "@pokemmo/projects/PokemonName";
// import { NatureView } from "@pokemmo/projects/NatureView";
// import { IVView } from "@pokemmo/projects/IVView";

// interface IPokemonTreeItem {
//     pokemon: PokemonType;
//     children: IPokemonTreeItem[];
// }

// function mapPokemonToTree(
//     pokemonID: string,
//     allPokemon: PokemonByID,
// ): IPokemonTreeItem {
//     const pokemon = allPokemon[pokemonID];

//     return {
//         pokemon,
//         children: pokemon.parentIDs
//             ? Object.values(pokemon.parentIDs).map(id =>
//                   mapPokemonToTree(id, allPokemon),
//               )
//             : [],
//     };
// }

// const TableStyler = styled.div`
//     & [role="gridcell"]:first-child {
//         // display: flex;
//         // justify-content: flex-end;

//         // & > *:first-child {
//         //     margin-right: auto;
//         // }
//     }
// `;

// const StickyTableHead = styled.div`
//     background: #f9fafb;
//     position: sticky;
//     top: 0;
//     z-index: 1;
// `;

// const CustomCell = styled(Cell)<{ isUsed?: boolean }>`
//     opacity: ${props => (props.isUsed ? 0.7 : 1)};
// `;

export function PokemonTree(props: any) {
    return <div>Hello Pokemon Tree</div>;
}

// export function PokemonTree(props: {
//     projectID: string;
//     onCalculateClick?: () => void;
// }) {
//     const project = useProject(props.projectID);
//     const pokemon = useProjectPokemon(props.projectID);
//     const allPokemon = useAllPokemon();
//     const { setPokemonStatus } = usePokemonActions();
//     const { expandPokemon, collapsePokemon } = useProjectActions();

//     if (!project || !pokemon) {
//         return null;
//     }

//     const { expandedPokemonIDs } = project;

//     const treeData = [mapPokemonToTree(pokemon.uuid, allPokemon)];

//     return (
//         <TableStyler>
//             <TableTree>
//                 <StickyTableHead>
//                     <Headers>
//                         <Header width={"20%"} style={{ flex: 1 }}>
//                             Pokemon
//                         </Header>
//                         <Header width={80}>Gender</Header>
//                         <Header width={150}>Nature</Header>
//                         <Header width={400}>Stats</Header>
//                         <Header width={100}>Complete</Header>
//                     </Headers>
//                 </StickyTableHead>
//                 <Rows
//                     items={treeData}
//                     render={({ pokemon, children }: IPokemonTreeItem) => {
//                         if (!pokemon) {
//                             return null;
//                         }

//                         const isUsed = pokemon.status === PokemonStatus.USED;
//                         return (
//                             <Row
//                                 itemId={pokemon.uuid}
//                                 items={children}
//                                 hasChildren={children.length > 0}
//                                 isExpanded={
//                                     expandedPokemonIDs[pokemon.uuid] ?? true
//                                 }
//                                 onExpand={() =>
//                                     expandPokemon({
//                                         pokemonID: pokemon.uuid,
//                                         projectID: project.projectID,
//                                     })
//                                 }
//                                 onCollapse={() =>
//                                     collapsePokemon({
//                                         pokemonID: pokemon.uuid,
//                                         projectID: project.projectID,
//                                     })
//                                 }
//                             >
//                                 <CustomCell
//                                     isUsed={isUsed}
//                                     width={"20%"}
//                                     style={{ flex: 1 }}
//                                 >
//                                     <PokemonName
//                                         withSprite
//                                         name={pokemon.name}
//                                     />
//                                 </CustomCell>
//                                 <CustomCell isUsed={isUsed}>
//                                     <em>{pokemon.gender}</em>
//                                 </CustomCell>
//                                 <CustomCell isUsed={isUsed}>
//                                     <NatureView
//                                         nature={pokemon.nature}
//                                         isVertical
//                                     />
//                                 </CustomCell>
//                                 <CustomCell isUsed={isUsed}>
//                                     <IVView
//                                         ivRequirements={pokemon.ivRequirements}
//                                     />
//                                 </CustomCell>

//                                 <CustomCell isUsed={isUsed}>
//                                     <Checkbox
//                                         onChange={() => {
//                                             if (isUsed) {
//                                                 setPokemonStatus({
//                                                     pokemon,
//                                                     status: PokemonStatus.READY,
//                                                 });
//                                             } else {
//                                                 setPokemonStatus({
//                                                     pokemon,
//                                                     status: PokemonStatus.USED,
//                                                 });
//                                             }
//                                         }}
//                                         isChecked={isUsed}
//                                     />
//                                 </CustomCell>
//                             </Row>
//                         );
//                     }}
//                 />
//             </TableTree>
//         </TableStyler>
//     );
// }
