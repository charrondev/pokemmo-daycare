import { Gender } from "./Pokemon";

export enum Stat {
    HP = "HP",
    ATTACK = "Attack",
    DEFENSE = "Defense",
    SPECIAL_ATTACK = "Special Attack",
    SPECIAL_DEFENSE = "Special Defense",
    SPEED = "speed"
}

export interface Nature {
    name: string;
    positiveStat: Stat | null;
    negativeStat: Stat | null;
}

export type IVRequirements = Partial<
    Record<
        Stat,
        {
            prices: Partial<Record<Gender, number>>
        }
    >
>;

export function subtractIVRequirement(requirements: IVRequirements, statToRemove: Stat): IVRequirements {
    const newRequirements: IVRequirements = {};
    for (const [stat, info] of Object.entries(requirements)) {
        if (stat !== statToRemove && info) {
            newRequirements[stat as Stat] = info
        }
    }

    return newRequirements;
}