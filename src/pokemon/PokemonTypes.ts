/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

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

export type IVRequirements = Record<
    Stat,
    {
        value: number;
        prices: Partial<Record<Gender, number>>;
    }
>;
export type ActiveIVs = Partial<Record<Stat, boolean>>;

export enum Gender {
    MALE = "male",
    FEMALE = "female",
}

export enum OwnershipStatus {
    CAUGHT = "caught",
    BRED = "bred",
    BOUGHT = "bought",
}

export enum BreedStatus {
    USED = "used",
    EGG = "egg",
    NONE = "none",
}

export type ParentIDs = Record<Gender, string> | null;

export interface IPokemon {
    // Pokemon info
    identifier: string;
    ivs: IVRequirements;
    gender: Gender;
    nature: string | null;

    // IDs
    _uuid: string;
    id: string;
    childID: string | null;
    parentIDs: ParentIDs;

    // status
    projectIDs: string[];
    ownershipStatus: OwnershipStatus;
    boughtPrice: number;
    breedStatus: BreedStatus;
}
