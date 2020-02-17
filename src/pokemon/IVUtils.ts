export enum Stat {
    HP = "HP",
    ATTACK = "Atk",
    DEFENSE = "Def",
    SPECIAL_ATTACK = "Sp. Atk",
    SPECIAL_DEFENSE = "Sp. Def",
    SPEED = "Speed",
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

export function ivRequirementsAsString(reqs: IVRequirements): string {
    const statNum = (stat: Stat) => {
        const statInfo = reqs[stat];
        if (!statInfo) {
            return 0;
        } else {
            return statInfo.value || 31;
        }
    };
    return `${statNum(Stat.HP)}_${statNum(Stat.ATTACK)}_${statNum(
        Stat.DEFENSE,
    )}_${statNum(Stat.SPECIAL_ATTACK)}_${statNum(
        Stat.SPECIAL_DEFENSE,
    )}_${statNum(Stat.SPEED)}`;
}

export type ActiveIVs = Partial<Record<Stat, boolean>>;

export enum Gender {
    MALE = "male",
    FEMALE = "female",
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
    statToRemove: Stat,
): IVRequirements {
    const newRequirements: IVRequirements = {};
    for (const [stat, info] of Object.entries(requirements)) {
        if (stat !== statToRemove) {
            newRequirements[stat as Stat] = info;
        }
    }

    return newRequirements;
}
