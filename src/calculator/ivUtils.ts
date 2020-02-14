export enum Stat {
    HP = "HP",
    ATTACK = "Atk",
    DEFENSE = "Def",
    SPECIAL_ATTACK = "Sp. Atk",
    SPECIAL_DEFENSE = "Sp. Def",
    SPEED = "Speed"
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
            value?: number;
            prices: Partial<Record<Gender, number>>;
        }
    >
>;

export type ActiveIVs = Partial<Record<Stat, boolean>>;

export enum Gender {
    MALE = "male",
    FEMALE = "female"
}

export function swapGender(gender: Gender): Gender {
    if (gender === Gender.MALE) {
        return Gender.FEMALE;
    } else {
        return Gender.MALE;
    }
}

export function subtractIVRequirement(
    requirements: IVRequirements,
    statToRemove: Stat
): IVRequirements {
    const newRequirements: IVRequirements = {};
    for (const [stat, info] of Object.entries(requirements)) {
        if (stat !== statToRemove) {
            newRequirements[stat as Stat] = info;
        }
    }

    return newRequirements;
}
