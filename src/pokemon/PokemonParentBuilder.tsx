/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

export const temp = "";
/**
 * Class for pokemon data manipulations.
 */
// export class PokemonParentBuilder extends PokemonStoreAccessor {
// public static calculatePokemonCost(pokemon: IPokemon): number {
//     if (pokemon.parents) {
//         return (
//             pokemon.parents.male.calculatePokemonCost() +
//             pokemon.parents.female.calculatePokemonCost()
//         );
//     } else {
//         const statInfos = Object.values(pokemon.ivRequirements);
//         if (statInfos.length !== 1) {
//             throw new Error(
//                 "Fatal Calculation Error. Pokemon has no parents, but multiple IVs",
//             );
//         }
//         const info = statInfos[0];
//         return (
//             info?.prices[pokemon.gender] ?? PokemonFactory.AVERAGE_UNDEFINED_PRICE
//         );
//     }
// }
// public static calculateBracerTotal(pokemon: IPokemon): number {
//     if (pokemon.parents) {
//         return (
//             pokemon.parents.male.calculateBracerTotal() +
//             pokemon.parents.female.calculateBracerTotal()
//         );
//     } else {
//         return pokemon.nature !== null ? 1 : 0;
//     }
// }
// public ownBracerTotal(): number {
//     return this.nature !== null ? 1 : 0;
// }
// public ownEverstoneTotal(): number {
//     return this.nature === null ? 1 : 0;
// }
// }
