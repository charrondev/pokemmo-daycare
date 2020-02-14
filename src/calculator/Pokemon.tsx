/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import {
    Nature,
    Stat,
    IVRequirements,
    subtractIVRequirement,
    Gender,
    swapGender
} from "./IVUtils";

/**
 * Class for pokemon data manipulations.
 */
export class Pokemon {
    public parents: Record<Gender, Pokemon> | null = null;

    public uuid: string = uuidv4();

    public static BRACER_COST = 10000;
    public static AVERAGE_UNDEFINED_PRICE = 10000;
    public static EVERSTONE_COST = 7000;

    public constructor(
        public name: string,
        public ivRequirements: IVRequirements,
        public gender: Gender,
        public nature: Nature | null
    ) {
        // This is the stat/gender that's most expensive.
        // It should be elimated first.
        const mostExpensive = this.getMostExpensiveStatGender();

        if (!mostExpensive) {
            return;
        }

        let statCount = Object.keys(this.ivRequirements).length;

        if (this.nature) {
            if (statCount === 0) {
                return;
            }
            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.
            const firstParentStat = mostExpensive.stat;
            const firstParentGender = swapGender(mostExpensive.gender);
            const secondParentGender = mostExpensive.gender;

            this.parents = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: new Pokemon(
                    this.name,
                    this.ivRequirements,
                    firstParentGender,
                    null
                ),
                [secondParentGender as Gender.FEMALE]: new Pokemon(
                    this.name,
                    subtractIVRequirement(this.ivRequirements, firstParentStat),
                    secondParentGender,
                    this.nature
                )
            };
        } else {
            if (statCount <= 1) {
                // Only 1 stat needed. Moving on.
                return;
            }

            // We have no nature specified. As a result, both pokemon targetted will have 1 less pokemon than before.
            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.
            const firstParentStat = mostExpensive.stat;
            const firstParentGender = swapGender(mostExpensive.gender);
            const secondParentGender = mostExpensive.gender;
            const secondParentRequirements = subtractIVRequirement(
                this.ivRequirements,
                firstParentStat
            );
            const secondParentStat = this.mostExpensiveStat(
                secondParentGender,
                secondParentRequirements
            );

            if (!secondParentStat) {
                throw new Error("Shouldn't happen");
            }
            const firstParentRequirements = subtractIVRequirement(
                this.ivRequirements,
                secondParentStat
            );

            this.parents = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: new Pokemon(
                    this.name,
                    firstParentRequirements,
                    firstParentGender,
                    null
                ),
                [secondParentGender as Gender.FEMALE]: new Pokemon(
                    this.name,
                    secondParentRequirements,
                    secondParentGender,
                    null
                )
            };
        }
    }

    /**
     * Get the most expensive stat/gender combo.
     */
    private getMostExpensiveStatGender() {
        const mostExpMaleStat = this.mostExpensiveStat(Gender.MALE);
        const mostExpFemaleStat = this.mostExpensiveStat(Gender.FEMALE);

        if (!mostExpMaleStat || !mostExpFemaleStat) {
            return null;
        }

        if (
            this.getPriceForStat(mostExpMaleStat, Gender.MALE) >
            this.getPriceForStat(mostExpFemaleStat, Gender.FEMALE)
        ) {
            return {
                stat: mostExpMaleStat,
                gender: Gender.MALE
            };
        } else {
            return {
                stat: mostExpFemaleStat,
                gender: Gender.FEMALE
            };
        }
    }

    public calculatePokemonCost(): number {
        if (this.parents) {
            return (
                this.parents.male.calculatePokemonCost() +
                this.parents.female.calculatePokemonCost()
            );
        } else {
            const statInfos = Object.values(this.ivRequirements);
            if (statInfos.length !== 1) {
                throw new Error(
                    "Fatal Calculation Error. Pokemon has no parents, but multiple IVs"
                );
            }

            const info = statInfos[0];
            return info?.prices[this.gender] ?? Pokemon.AVERAGE_UNDEFINED_PRICE;
        }
    }

    public calculateBracerTotal(): number {
        if (this.parents) {
            return (
                this.parents.male.calculateBracerTotal() +
                this.parents.female.calculateBracerTotal()
            );
        } else {
            return this.nature !== null ? 1 : 0;
        }
    }

    public ownBracerTotal(): number {
        return this.nature !== null ? 1 : 0;
    }

    public ownEverstoneTotal(): number {
        return this.nature === null ? 1 : 0;
    }

    public getPriceForStat(stat: Stat, gender: Gender): number {
        return (
            this.ivRequirements[stat]?.prices?.[gender] ??
            Pokemon.AVERAGE_UNDEFINED_PRICE
        );
    }

    private mostExpensiveStat(
        gender: Gender,
        ofRequirements: IVRequirements = this.ivRequirements
    ): Stat | null {
        let mostExpensiveIV: Stat | null = null;
        let mostExpensiveIVPrice: number = Pokemon.AVERAGE_UNDEFINED_PRICE;

        for (const [stat, info] of Object.entries(ofRequirements)) {
            const price =
                info?.prices?.[gender] ?? Pokemon.AVERAGE_UNDEFINED_PRICE;
            if (price >= mostExpensiveIVPrice) {
                mostExpensiveIVPrice = price;
                mostExpensiveIV = stat as Stat;
            }
        }

        return mostExpensiveIV;
    }
}

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
