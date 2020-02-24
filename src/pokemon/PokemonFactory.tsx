/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { sample } from "lodash-es";
import {
    IVRequirements,
    Gender,
    Nature,
    ivRequirementsAsString,
    swapGender,
    subtractIVRequirement,
    Stat,
} from "@pokemmo/pokemon/IVUtils";
import { uuidv4 } from "@pokemmo/utils";

export enum OwnershipStatus {
    BOUGHT = "bought",
    BRED = "bred",
    CAUGHT = "caught",
}

export enum PokemonStatus {
    USED = "used",
    EGG = "egg",
    NONE = "none",
}

export interface PokemonType {
    name: string;
    ivRequirements: IVRequirements;
    gender: Gender;
    nature: Nature | null;

    // Calculated
    childID: string | null;
    parentIDs: Record<Gender, string> | null;
    uuid: string;

    // status
    projectIDs: string[];
    status: PokemonStatus;
}

/**
 * Class for pokemon data manipulations.
 */
export class PokemonFactory {
    public static BRACER_COST = 10000;
    public static AVERAGE_UNDEFINED_PRICE = 10000;
    public static EVERSTONE_COST = 7000;

    public static create(
        name: string,
        ivRequirements: IVRequirements,
        gender: Gender,
        nature: Nature | null,
        childID: string | null = null,
        projectIDs: string[] = [],
        allowedAlternatives?: string[],
        forceName?: boolean,
    ) {
        let finalName = name;
        if (!forceName && allowedAlternatives && gender !== Gender.FEMALE) {
            finalName = sample([name, ...allowedAlternatives])!;
        }

        const pokemon: PokemonType = {
            name: finalName,
            ivRequirements,
            gender,
            nature,
            uuid: `${name}-${gender}-${ivRequirementsAsString(
                ivRequirements,
            )}-${nature ? nature.name + "-" : ""}${uuidv4()}`,
            parentIDs: null,
            childID: childID,
            status: PokemonStatus.NONE,
            projectIDs: projectIDs,
        };

        const { parentIDs, allParents } = this.calculateParents(
            pokemon,
            projectIDs,
            allowedAlternatives,
        );

        allParents.forEach(parent => {
            parent.projectIDs = projectIDs;
        });
        pokemon.parentIDs = parentIDs;
        return {
            pokemon,
            allParents,
        };
    }

    public static calculateParents(
        pokemon: PokemonType,
        projectIDs?: string[],
        allowedAlternatives?: string[],
    ): {
        parentIDs: Record<Gender, string> | null;
        allParents: PokemonType[];
    } {
        // This is the stat/gender that's most expensive.
        // It should be elimated first.
        const mostExpensive = this.getMostExpensiveStatGender(pokemon);

        const EMPTY_RESULT = { parentIDs: null, allParents: [] };

        if (!mostExpensive) {
            return EMPTY_RESULT;
        }

        let statCount = Object.keys(pokemon.ivRequirements).length;

        if (pokemon.nature) {
            if (statCount === 0) {
                return EMPTY_RESULT;
            }
            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.
            const firstParentStat = mostExpensive.stat;
            const firstParentGender = swapGender(mostExpensive.gender);
            const secondParentGender = mostExpensive.gender;

            const {
                pokemon: firstParent,
                allParents: firstAncestors,
            } = PokemonFactory.create(
                pokemon.name,
                pokemon.ivRequirements,
                firstParentGender,
                null,
                pokemon.uuid,
                projectIDs,
                allowedAlternatives,
            );

            const {
                pokemon: secondParent,
                allParents: secondAncestors,
            } = PokemonFactory.create(
                pokemon.name,
                subtractIVRequirement(pokemon.ivRequirements, firstParentStat),
                secondParentGender,
                pokemon.nature,
                pokemon.uuid,
                projectIDs,
                allowedAlternatives,
            );

            const parentIDs = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: firstParent.uuid,
                [secondParentGender as Gender.FEMALE]: secondParent.uuid,
            };

            const allParents = [
                firstParent,
                secondParent,
                ...firstAncestors,
                ...secondAncestors,
            ];

            return { parentIDs, allParents };
        } else {
            if (statCount <= 1) {
                // Only 1 stat needed. Moving on.
                return EMPTY_RESULT;
            }

            // We have no nature specified. As a result, both pokemon targetted will have 1 less pokemon than before.
            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.
            const firstParentStat = mostExpensive.stat;
            const firstParentGender = swapGender(mostExpensive.gender);
            const secondParentGender = mostExpensive.gender;
            const secondParentRequirements = subtractIVRequirement(
                pokemon.ivRequirements,
                firstParentStat,
            );
            const secondParentStat = this.mostExpensiveStat(
                pokemon,
                secondParentGender,
                secondParentRequirements,
            );

            if (!secondParentStat) {
                throw new Error("Shouldn't happen");
            }
            const firstParentRequirements = subtractIVRequirement(
                pokemon.ivRequirements,
                secondParentStat,
            );

            const {
                pokemon: firstParent,
                allParents: firstAncestors,
            } = PokemonFactory.create(
                pokemon.name,
                firstParentRequirements,
                firstParentGender,
                null,
                pokemon.uuid,
                projectIDs,
                allowedAlternatives,
            );

            const {
                pokemon: secondParent,
                allParents: secondAncestors,
            } = PokemonFactory.create(
                pokemon.name,
                secondParentRequirements,
                secondParentGender,
                null,
                pokemon.uuid,
                projectIDs,
                allowedAlternatives,
            );

            const parentIDs = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: firstParent.uuid,
                [secondParentGender as Gender.FEMALE]: secondParent.uuid,
            };

            const allParents = [
                firstParent,
                secondParent,
                ...firstAncestors,
                ...secondAncestors,
            ];

            return { parentIDs, allParents };
        }
    }

    /**
     * Get the most expensive stat/gender combo.
     */
    private static getMostExpensiveStatGender(pokemon: PokemonType) {
        const mostExpMaleStat = this.mostExpensiveStat(pokemon, Gender.MALE);
        const mostExpFemaleStat = this.mostExpensiveStat(
            pokemon,
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

    // public static calculatePokemonCost(pokemon: PokemonType): number {
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

    // public static calculateBracerTotal(pokemon: PokemonType): number {
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

    public static getPriceForStat(
        pokemon: PokemonType,
        stat: Stat,
        gender: Gender,
    ): number {
        return (
            pokemon.ivRequirements[stat]?.prices?.[gender] ??
            PokemonFactory.AVERAGE_UNDEFINED_PRICE
        );
    }

    private static mostExpensiveStat(
        pokemon: PokemonType,
        gender: Gender,
        ofRequirements: IVRequirements = pokemon.ivRequirements,
    ): Stat | null {
        let mostExpensiveIV: Stat | null = null;
        let mostExpensiveIVPrice: number =
            PokemonFactory.AVERAGE_UNDEFINED_PRICE;

        for (const [stat, info] of Object.entries(ofRequirements)) {
            const price =
                info?.prices?.[gender] ||
                PokemonFactory.AVERAGE_UNDEFINED_PRICE;
            if (price >= mostExpensiveIVPrice) {
                mostExpensiveIVPrice = price;
                mostExpensiveIV = stat as Stat;
            }
        }

        return mostExpensiveIV;
    }
}
