import { Nature, Stat, IVRequirements, subtractIVRequirement } from "./ivUtils";

/**
 * Class for pokemon data manipulations.
 */

export enum Gender {
    MALE = "male",
    FEMALE = "female"
}


class Pokemon {

    public maleParent: Pokemon | null;
    public femaleParent: Pokemon | null;

    public static BRACER_COST = 10000;
    public static AVERAGE_UNDEFINED_PRICE = 10000;
    public static EVERSTONE_COST = 7000;

    public constructor(public ivRequirements: IVRequirements, public gender: Gender, public nature: Nature | null) {
        const mostExpMaleStat = this.mostExpensiveStat(Gender.MALE);
        const secondExpMaleStat = this.secondMostExpensiveStat(Gender.MALE);
        const mostExpFemaleStat = this.mostExpensiveStat(Gender.FEMALE);
        const secondExpFemaleState = this.secondMostExpensiveStat(Gender.FEMALE);

        
    }

    public calculatePokemonCost(): number {
        if (this.maleParent && this.femaleParent) {
            return this.maleParent.calculatePokemonCost() + this.femaleParent.calculatePokemonCost();
        } else {
            const statInfos = Object.values(this.ivRequirements);
            if (statInfos.length !== 1) {
                throw new Error("Fatal Calculation Error. Pokemon has no parents, but multiple IVs");
            }

            const info = statInfos[0];
            return info?.prices[this.gender] ?? Pokemon.AVERAGE_UNDEFINED_PRICE;
        }
    }

    public calculateBracerTotal(): number {
        if (this.maleParent && this.femaleParent) {
            return this.maleParent.calculateBracerTotal() + this.femaleParent.calculateBracerTotal();
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
        return this.ivRequirements[stat]?.prices[gender] ?? Pokemon.AVERAGE_UNDEFINED_PRICE;
    }

    private mostExpensiveStat(gender: Gender, ofRequirements: IVRequirements = this.ivRequirements): Stat {
        let mostExpensiveIV: Stat = Stat.HP;
        let mostExpensiveIVPrice: number = Pokemon.AVERAGE_UNDEFINED_PRICE;

        for (const [stat, info] of Object.entries(ofRequirements)) {
            const price = info?.prices?.[gender] ?? Pokemon.AVERAGE_UNDEFINED_PRICE;
            if (price > mostExpensiveIVPrice) {
                mostExpensiveIVPrice = price;
                mostExpensiveIV = stat as Stat;
            }
        }

        return mostExpensiveIV;
    }

    private secondMostExpensiveStat(gender: Gender): Stat {
        const mostExpensiveDropped = subtractIVRequirement(this.ivRequirements, this.mostExpensiveStat(gender));
        return this.mostExpensiveStat(gender, mostExpensiveDropped);
    }
}
