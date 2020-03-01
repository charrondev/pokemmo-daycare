/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { Nature, Stat } from "@pokemmo/pokemon/PokemonTypes";

export const Hardy: Nature = {
    name: "Hardy",
    positiveStat: null,
    negativeStat: null,
};
export const Lonely: Nature = {
    name: "Lonely",
    positiveStat: Stat.ATTACK,
    negativeStat: Stat.DEFENSE,
};
export const Brave: Nature = {
    name: "Brave",
    positiveStat: Stat.ATTACK,
    negativeStat: Stat.SPEED,
};
export const Adamant: Nature = {
    name: "Adamant",
    positiveStat: Stat.ATTACK,
    negativeStat: Stat.SPECIAL_ATTACK,
};
export const Naughty: Nature = {
    name: "Naughty",
    positiveStat: Stat.ATTACK,
    negativeStat: Stat.SPECIAL_DEFENSE,
};
export const Bold: Nature = {
    name: "Bold",
    positiveStat: Stat.DEFENSE,
    negativeStat: Stat.ATTACK,
};
export const Docile: Nature = {
    name: "Docile",
    positiveStat: null,
    negativeStat: null,
};
export const Relaxed: Nature = {
    name: "Relaxed",
    positiveStat: Stat.DEFENSE,
    negativeStat: Stat.SPEED,
};
export const Impish: Nature = {
    name: "Impish",
    positiveStat: Stat.DEFENSE,
    negativeStat: Stat.SPECIAL_ATTACK,
};
export const Lax: Nature = {
    name: "Lax",
    positiveStat: Stat.DEFENSE,
    negativeStat: Stat.SPECIAL_DEFENSE,
};
export const Timid: Nature = {
    name: "Timid",
    positiveStat: Stat.SPEED,
    negativeStat: Stat.ATTACK,
};
export const Hasty: Nature = {
    name: "Hasty",
    positiveStat: Stat.SPEED,
    negativeStat: Stat.DEFENSE,
};
export const Serious: Nature = {
    name: "Serious",
    positiveStat: null,
    negativeStat: null,
};
export const Jolly: Nature = {
    name: "Jolly",
    positiveStat: Stat.SPEED,
    negativeStat: Stat.SPECIAL_ATTACK,
};
export const Naive: Nature = {
    name: "Naive",
    positiveStat: Stat.SPEED,
    negativeStat: Stat.SPECIAL_DEFENSE,
};
export const Modest: Nature = {
    name: "Modest",
    positiveStat: Stat.SPECIAL_ATTACK,
    negativeStat: Stat.ATTACK,
};
export const Mild: Nature = {
    name: "Mild",
    positiveStat: Stat.SPECIAL_ATTACK,
    negativeStat: Stat.DEFENSE,
};
export const Quiet: Nature = {
    name: "Quiet",
    positiveStat: Stat.SPECIAL_ATTACK,
    negativeStat: Stat.SPEED,
};
export const Bashful: Nature = {
    name: "Bashful",
    positiveStat: null,
    negativeStat: null,
};
export const Rash: Nature = {
    name: "Rash",
    positiveStat: Stat.SPECIAL_ATTACK,
    negativeStat: Stat.SPECIAL_DEFENSE,
};
export const Calm: Nature = {
    name: "Calm",
    positiveStat: Stat.SPECIAL_DEFENSE,
    negativeStat: Stat.ATTACK,
};
export const Gentle: Nature = {
    name: "Gentle",
    positiveStat: Stat.SPECIAL_DEFENSE,
    negativeStat: Stat.DEFENSE,
};
export const Sassy: Nature = {
    name: "Sassy",
    positiveStat: Stat.SPECIAL_DEFENSE,
    negativeStat: Stat.SPEED,
};
export const Careful: Nature = {
    name: "Careful",
    positiveStat: Stat.SPECIAL_DEFENSE,
    negativeStat: Stat.SPECIAL_ATTACK,
};
export const Quirky: Nature = {
    name: "Quirky",
    positiveStat: null,
    negativeStat: null,
};

export const allNatures = {
    Hardy,
    Lonely,
    Brave,
    Adamant,
    Naughty,
    Bold,
    Docile,
    Relaxed,
    Impish,
    Lax,
    Timid,
    Hasty,
    Serious,
    Jolly,
    Naive,
    Modest,
    Mild,
    Quiet,
    Bashful,
    Rash,
    Calm,
    Gentle,
    Sassy,
    Careful,
    Quirky,
};

export function getNature(
    natureName: string | undefined | null,
): Nature | null {
    if (natureName && !(natureName in allNatures)) {
        return null;
    }
    return allNatures[natureName as keyof typeof allNatures];
}
