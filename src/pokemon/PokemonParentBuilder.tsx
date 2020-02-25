/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { subtractIVRequirement, swapGender } from "@pokemmo/pokemon/IVUtils";
import {
    Gender,
    IPokemon,
    IVRequirements,
    Stat,
    ParentIDs,
} from "@pokemmo/pokemon/PokemonTypes";
import { PokemonStoreAccessor } from "@pokemmo/pokemon/PokemonStoreAccessor";
import { PokemonBuilder } from "@pokemmo/pokemon/PokemonBuilder";
import { sample } from "lodash-es";

export interface IParentBuilderOptions {
    allowedAlts: string[];
}

export const DEFAULT_PARENT_BUILDER_OPTIONS: IParentBuilderOptions = {
    allowedAlts: [],
};

/**
 * Class for pokemon data manipulations.
 */
export class PokemonParentBuilder extends PokemonStoreAccessor {
    public static BRACER_COST = 10000;
    public static AVERAGE_UNDEFINED_PRICE = 10000;
    public static EVERSTONE_COST = 7000;

    /**
     * Calculate the parents for a pokemon.
     * @param pokemon The pokemon to calculate from.
     * @param options Breeding options.
     */
    public calculateParents(
        pokemon: IPokemon,
        options: IParentBuilderOptions = DEFAULT_PARENT_BUILDER_OPTIONS,
    ): ParentIDs {
        // This is the stat/gender that's most expensive.
        // It should be elimated first.
        const mostExpensive = this.getMostExpensiveStatGender(pokemon);
        const EMPTY_RESULT: ParentIDs = null;

        if (!mostExpensive) {
            return EMPTY_RESULT;
        }
        const sampledName = sample([
            pokemon.identifier,
            ...options.allowedAlts,
        ])!;
        let statCount = Object.keys(pokemon.ivs).length;
        const firstParentStat = mostExpensive.stat;
        const firstParentGender = swapGender(mostExpensive.gender);
        const firstParentIdentifier =
            firstParentGender === Gender.MALE
                ? sampledName
                : pokemon.identifier;
        const secondParentGender = mostExpensive.gender;
        const secondParentIdentifier =
            secondParentGender === Gender.MALE
                ? sampledName
                : pokemon.identifier;

        if (pokemon.nature) {
            if (statCount === 0) {
                return EMPTY_RESULT;
            }

            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.

            const firstParent = PokemonBuilder.create(firstParentIdentifier)
                .ivs(pokemon.ivs)
                .gender(firstParentGender)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            const secondParent = PokemonBuilder.create(secondParentIdentifier)
                .ivs(subtractIVRequirement(pokemon.ivs, firstParentStat))
                .gender(secondParentGender)
                .nature(pokemon.nature)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            // Stash the pokemon in the store.
            this.storeActions.addPokemon([firstParent, secondParent]);

            const parentIDs = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: firstParent.id,
                [secondParentGender as Gender.FEMALE]: secondParent.id,
            };

            return parentIDs;
        } else {
            if (statCount <= 1) {
                // Only 1 stat needed. Moving on.
                return EMPTY_RESULT;
            }

            // We have no nature specified. As a result, both pokemon targetted will have 1 less pokemon than before.
            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.

            const secondParentRequirements = subtractIVRequirement(
                pokemon.ivs,
                firstParentStat,
            );
            const secondParentStat = this.mostExpensiveStat(
                secondParentRequirements,
                secondParentGender,
            );

            if (!secondParentStat) {
                throw new Error("Shouldn't happen");
            }
            const firstParentIVs = subtractIVRequirement(
                pokemon.ivs,
                secondParentStat,
            );

            const firstParent = PokemonBuilder.create(firstParentIdentifier)
                .ivs(firstParentIVs)
                .gender(firstParentGender)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            const secondParent = PokemonBuilder.create(secondParentIdentifier)
                .ivs(secondParentRequirements)
                .gender(secondParentGender)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            const parentIDs = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: firstParent.id,
                [secondParentGender as Gender.FEMALE]: secondParent.id,
            };

            return parentIDs;
        }
    }

    /**
     * Get the most expensive stat/gender combo.
     */
    private getMostExpensiveStatGender(pokemon: IPokemon) {
        const mostExpMaleStat = this.mostExpensiveStat(
            pokemon.ivs,
            Gender.MALE,
        );
        const mostExpFemaleStat = this.mostExpensiveStat(
            pokemon.ivs,
            Gender.FEMALE,
        );

        if (!mostExpMaleStat || !mostExpFemaleStat) {
            return null;
        }

        if (
            this.getPriceForStat(pokemon, mostExpMaleStat, Gender.MALE) >
            this.getPriceForStat(pokemon, mostExpFemaleStat, Gender.FEMALE)
        ) {
            return {
                stat: mostExpMaleStat,
                gender: Gender.MALE,
            };
        } else {
            return {
                stat: mostExpFemaleStat,
                gender: Gender.FEMALE,
            };
        }
    }

    /**
     * Look into a pokemons info and find the price for a stat/gender combo.
     */
    private getPriceForStat(
        pokemon: IPokemon,
        stat: Stat,
        gender: Gender,
    ): number {
        return (
            pokemon.ivs[stat].prices[gender] ??
            PokemonParentBuilder.AVERAGE_UNDEFINED_PRICE
        );
    }

    /**
     * Find the most expensive stat out of some requirements for a particular gender.
     */
    private mostExpensiveStat(
        ivs: IVRequirements,
        gender: Gender,
    ): Stat | null {
        let mostExpensiveIV: Stat | null = null;
        let mostExpensiveIVPrice: number =
            PokemonParentBuilder.AVERAGE_UNDEFINED_PRICE;

        for (const [stat, info] of Object.entries(ivs)) {
            const price =
                info?.prices?.[gender] ||
                PokemonParentBuilder.AVERAGE_UNDEFINED_PRICE;
            if (price >= mostExpensiveIVPrice) {
                mostExpensiveIVPrice = price;
                mostExpensiveIV = stat as Stat;
            }
        }

        return mostExpensiveIV;
    }

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
}
