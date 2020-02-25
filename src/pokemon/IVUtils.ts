/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { IVRequirements, Stat, Gender } from "@pokemmo/pokemon/PokemonTypes";

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
