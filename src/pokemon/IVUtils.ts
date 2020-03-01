/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { Gender, IVRequirements, Stat } from "@pokemmo/pokemon/PokemonTypes";

export const EMPTY_IV = Object.freeze({
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
    const newRequirements: IVRequirements = EMPTY_IVS;
    for (const [stat, info] of Object.entries(requirements)) {
        if (stat !== statToRemove) {
            newRequirements[stat as Stat] = info;
        }
    }

    return newRequirements;
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
