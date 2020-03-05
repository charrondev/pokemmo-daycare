/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

export enum Stat {
    HP = "hp",
    ATTACK = "atk",
    DEFENSE = "def",
    SPECIAL_ATTACK = "spAtk",
    SPECIAL_DEFENSE = "spDef",
    SPEED = "speed",
}

export interface Nature {
    name: string;
    positiveStat: Stat | null;
    negativeStat: Stat | null;
}

export type SingleStatInfo = {
    value: number;
    prices: Partial<Record<Gender, number>>;
};

export type IVRequirements = Record<Stat, SingleStatInfo>;
export type ActiveIVs = Partial<Record<Stat, boolean>>;

export enum Gender {
    MALE = "male",
    FEMALE = "female",
}

export enum OwnershipStatus {
    CAUGHT = "caught",
    BRED = "bred",
    BOUGHT = "bought",
    PROJECT = "project",
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

    // status
    projectIDs: string[];
    ownershipStatus: OwnershipStatus;
    boughtPrice: number;
    breedStatus: BreedStatus;
}

type BreederStubHash = string;

export interface IPokemonBreederStub {
    generation: number;
    attachedPokemonID: string | null;
    stubHash: BreederStubHash;
    stubID: string;
    parents: Record<Gender, BreederStubHash> | null;
    childHash: BreederStubHash | null;
    forcedIdentifier?: string | null;
    allowedIdentifiers: string[];
    ivs: IVRequirements;
    gender: Gender;
    nature: string | null;
}
