/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import {
    Gender,
    IVRequirements,
    SingleStatInfo,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";

export const EMPTY_IV: SingleStatInfo = Object.freeze({
    value: 0,
    prices: {},
});

export const EMPTY_IVS: IVRequirements = Object.freeze({
    [Stat.HP]: EMPTY_IV,
    [Stat.ATTACK]: EMPTY_IV,
    [Stat.DEFENSE]: EMPTY_IV,
    [Stat.SPECIAL_ATTACK]: EMPTY_IV,
    [Stat.SPECIAL_DEFENSE]: EMPTY_IV,
    [Stat.SPEED]: EMPTY_IV,
});

export function swapGender(gender: Gender): Gender {
    if (gender === Gender.MALE) {
        return Gender.FEMALE;
    } else {
        return Gender.MALE;
    }
}

export function subtractIVRequirement(
    requirements: IVRequirements,
    statToRemove: Stat,
): IVRequirements {
    const newRequirements: IVRequirements = { ...EMPTY_IVS };
    for (const [stat, info] of Object.entries(requirements)) {
        if (stat !== statToRemove) {
            newRequirements[stat as Stat] = info;
        }
    }

    return newRequirements;
}

export function ivsMeetMinimums(
    ivs: IVRequirements,
    minimums: Partial<IVRequirements>,
) {
    for (const [minimumStat, minimumData] of Object.entries(minimums)) {
        if (
            minimumData &&
            ivs[minimumStat as Stat].value < minimumData?.value
        ) {
            return false;
        }
    }

    return true;
}

export function nonEmptyIVs(ivs: IVRequirements): Partial<IVRequirements> {
    const result: Partial<IVRequirements> = {};
    for (const [stat, data] of Object.entries(ivs)) {
        if (data.value !== 0 && data.value != null) {
            result[stat as Stat] = data;
        }
    }
    return result;
}

export function nameForStat(stat: Stat): string {
    switch (stat) {
        case Stat.HP:
            return "HP";
        case Stat.ATTACK:
            return "Atk";
        case Stat.DEFENSE:
            return "Def";
        case Stat.SPECIAL_ATTACK:
            return "Sp. Atk";
        case Stat.SPECIAL_DEFENSE:
            return "Sp. Def";
        case Stat.SPEED:
            return "Speed";
    }
}

export class IVBuilder {
    private ivs: IVRequirements = {
        ...EMPTY_IVS,
    };

    public static maxedStats(stats: Stat[]) {
        const builder = IVBuilder.create();

        stats.forEach(stat => {
            builder.add(stat, { value: 31 });
        });
        return builder.result();
    }

    public static create() {
        return new IVBuilder();
    }

    public add(stat: Stat, info: Partial<SingleStatInfo>) {
        this.ivs[stat] = {
            ...EMPTY_IV,
            ...info,
        };
        return this;
    }

    public result() {
        return this.ivs;
    }
}
