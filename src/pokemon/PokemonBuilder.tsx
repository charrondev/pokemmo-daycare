/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import {
    EMPTY_IV,
    subtractIVRequirement,
    swapGender,
} from "@pokemmo/pokemon/IVUtils";
import { PokemonStoreAccessor } from "@pokemmo/pokemon/PokemonStoreAccessor";
import {
    BreedStatus,
    Gender,
    IPokemon,
    IPokemonBreederStub,
    IVRequirements,
    OwnershipStatus,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";
import { hashString, uuidv4 } from "@pokemmo/utils";

export interface IParentOptions {
    allowedIdentifiers: string[];
}

export const DEFAULT_PARENT_BUILDER_OPTIONS: IParentOptions = {
    allowedIdentifiers: [],
};

interface IStubAncestors {
    parents: Record<Gender, IPokemonBreederStub> | null;
    allParents: IPokemonBreederStub[];
}

const EMPTY_PARENT_GROUP: IStubAncestors = {
    parents: null,
    allParents: [],
};

/**
 * Builder pattern implementation for Pokemon.
 */
export class PokemonBuilder extends PokemonStoreAccessor {
    private _identifier: string;
    private _uuid: string = uuidv4();
    private _id: string = this.calculateID();

    public constructor(pokemon: IPokemon);
    public constructor(identifier: string);
    public constructor(pokemonOrIdentfier: IPokemon | string) {
        super();
        if (typeof pokemonOrIdentfier === "string") {
            this._identifier = pokemonOrIdentfier;
        } else {
            const pok = pokemonOrIdentfier;
            this._identifier = pok.identifier;
            this._uuid = pok._uuid;
            this._id = pok.id;
            this._ivs = pok.ivs;
            this._nature = pok.nature;
            this._gender = pok.gender;
            this._projectIDs = pok.projectIDs;
            this._breedStatus = pok.breedStatus;
            this._ownershipStatus = pok.ownershipStatus;
            this._boughtPrice = pok.boughtPrice;
        }
    }

    public static create(identifier: string): PokemonBuilder {
        return new PokemonBuilder(identifier);
    }

    public static from(pokemon: IPokemon): PokemonBuilder {
        const builder = new PokemonBuilder(pokemon);
        return builder;
    }

    public result(): IPokemon {
        return {
            identifier: this._identifier,
            ivs: this._ivs,
            nature: this._nature,
            gender: this._gender,

            _uuid: this._uuid,
            id: this._id,

            projectIDs: this._projectIDs,
            ownershipStatus: this._ownershipStatus,
            boughtPrice: this._boughtPrice,
            breedStatus: this._breedStatus,
        };
    }

    private _ivs: IVRequirements = {
        [Stat.HP]: EMPTY_IV,
        [Stat.ATTACK]: EMPTY_IV,
        [Stat.DEFENSE]: EMPTY_IV,
        [Stat.SPECIAL_ATTACK]: EMPTY_IV,
        [Stat.SPECIAL_DEFENSE]: EMPTY_IV,
        [Stat.SPEED]: EMPTY_IV,
    };
    public ivs(ivs: IVRequirements) {
        this._ivs = ivs;
        this.calculateID();
        return this;
    }

    private _nature: string | null = null;
    public nature(nature: string | null) {
        this._nature = nature;
        this.calculateID();
        return this;
    }

    private _gender: Gender = Gender.MALE;
    public gender(gender: Gender) {
        this._gender = gender;
        this.calculateID();
        return this;
    }

    // Statuses

    private _projectIDs: string[] = [];
    public projectIDs(projectIDs: string[]) {
        this._projectIDs = projectIDs;
        return this;
    }

    private _ownershipStatus: OwnershipStatus = OwnershipStatus.CAUGHT;
    private _boughtPrice: number = 0;
    public ownershipStatus(status: OwnershipStatus, boughtPrice: number = 0) {
        this._ownershipStatus = status;
        this._boughtPrice = boughtPrice;
        return this;
    }

    private _breedStatus: BreedStatus = BreedStatus.NONE;
    public breedStatus(status: BreedStatus) {
        this._breedStatus = status;
        return this;
    }

    ///
    /// Private Utilities.
    ///

    /**
     * Calculate the pokemon's ID based on it's info.
     */
    private calculateID() {
        const id = `${this._identifier}-${
            this._gender
        }-${PokemonBuilder.ivRequirementsAsString(this._ivs)}-${
            this._nature ? this._nature + "-" : ""
        }${this._uuid}`;
        this._id = id;
        return id;
    }

    public static ivRequirementsAsString(ivs: IVRequirements): string {
        const statNum = (stat: Stat) => {
            const statInfo = ivs?.[stat];
            if (!statInfo) {
                return (0).toString().padStart(2, "0");
            } else {
                return (statInfo.value ?? 31).toString().padStart(2, "0");
            }
        };
        return `${statNum(Stat.HP)}_${statNum(Stat.ATTACK)}_${statNum(
            Stat.DEFENSE,
        )}_${statNum(Stat.SPECIAL_ATTACK)}_${statNum(
            Stat.SPECIAL_DEFENSE,
        )}_${statNum(Stat.SPEED)}`;
    }

    // Parent calculation
    public static BRACER_COST = 10000;
    public static AVERAGE_UNDEFINED_PRICE = 10000;
    public static EVERSTONE_COST = 7000;

    public calculateBreeders(
        options: IParentOptions = DEFAULT_PARENT_BUILDER_OPTIONS,
    ): IPokemonBreederStub[] {
        const { ivs, nature, gender, identifier } = this.result();
        const stub = this.makeBreedingStub({
            ivs,
            nature,
            gender,
            allowedIdentifiers: [identifier],
            forcedIdentifier: identifier,
            generation: 0,
        });
        return [
            stub,
            ...this.internalCalculateBreeders(stub, options).allParents,
        ];
    }

    /**
     * Calculate the parents for a pokemon.
     * @param pokemon The pokemon to calculate from.
     * @param options Breeding options.
     */
    private internalCalculateBreeders(
        childStub: IPokemonBreederStub,
        options: IParentOptions = DEFAULT_PARENT_BUILDER_OPTIONS,
    ): IStubAncestors {
        // const stub = "stubHash" in pokemonOrStub ? pokemonOrStub : makeBreedingStub()

        // This is the stat/gender that's most expensive.
        // It should be elimated first.
        const mostExpensive = this.getMostExpensiveStatGender(childStub.ivs);

        if (!mostExpensive) {
            return EMPTY_PARENT_GROUP;
        }
        let statCount = Object.values(childStub.ivs).filter(
            iv => iv.value !== 0 && iv.value != null,
        ).length;
        const firstParentStat = mostExpensive.stat;

        // Select genders and names
        const { forcedIdentifier } = childStub;
        const firstParentGender = swapGender(mostExpensive.gender);

        // The female identifier must be preserved down the purely female line.
        const forcedIdentifierForGender = (gender: Gender): string | null => {
            if (gender === Gender.FEMALE && forcedIdentifier) {
                return forcedIdentifier;
            } else {
                return null;
            }
        };
        const allowedIdentifiersForGender = (gender: Gender): string[] => {
            if (gender === Gender.FEMALE && forcedIdentifier) {
                return [forcedIdentifier];
            } else {
                return Array.from(
                    new Set([
                        ...childStub.allowedIdentifiers,
                        ...options.allowedIdentifiers,
                    ]),
                );
            }
        };
        const secondParentGender = mostExpensive.gender;

        let firstParent: IPokemonBreederStub | null = null;
        let secondParent: IPokemonBreederStub | null = null;

        if (childStub.nature) {
            if (statCount === 0) {
                return EMPTY_PARENT_GROUP;
            }

            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.

            firstParent = this.makeBreedingStub({
                allowedIdentifiers: allowedIdentifiersForGender(
                    firstParentGender,
                ),
                forcedIdentifier: forcedIdentifierForGender(firstParentGender),
                ivs: childStub.ivs,
                gender: firstParentGender,
                nature: null, // Gender is forced onto the second parnet.
                generation: childStub.generation + 1,
            });

            secondParent = this.makeBreedingStub({
                allowedIdentifiers: allowedIdentifiersForGender(
                    secondParentGender,
                ),
                forcedIdentifier: forcedIdentifierForGender(secondParentGender),
                ivs: subtractIVRequirement(childStub.ivs, firstParentStat),
                gender: secondParentGender,
                nature: childStub.nature,
                generation: childStub.generation + 1,
            });
        } else {
            if (statCount <= 1) {
                // Only 1 stat needed. Moving on.
                return EMPTY_PARENT_GROUP;
            }

            // We have no nature specified. As a result, both pokemon targetted will have 1 less pokemon than before.
            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.

            const secondParentIVs = subtractIVRequirement(
                childStub.ivs,
                firstParentStat,
            );
            const secondParentStat = this.mostExpensiveStat(
                secondParentIVs,
                secondParentGender,
            );

            if (!secondParentStat) {
                console.error(childStub);
                throw new Error("Shouldn't happen");
            }
            const firstParentIVs = subtractIVRequirement(
                childStub.ivs,
                secondParentStat,
            );

            firstParent = this.makeBreedingStub({
                allowedIdentifiers: allowedIdentifiersForGender(
                    firstParentGender,
                ),
                forcedIdentifier: forcedIdentifierForGender(firstParentGender),
                ivs: firstParentIVs,
                gender: firstParentGender,
                nature: null, // No natures here.
                generation: childStub.generation + 1,
            });

            secondParent = this.makeBreedingStub({
                allowedIdentifiers: allowedIdentifiersForGender(
                    secondParentGender,
                ),
                forcedIdentifier: forcedIdentifierForGender(secondParentGender),
                ivs: secondParentIVs,
                gender: secondParentGender,
                nature: null, // No natures here.
                generation: childStub.generation + 1,
            });
        }

        // Recursively calculate parents and link them..
        const firstAncestors = this.internalCalculateBreeders(
            firstParent,
            options,
        );
        firstParent.childHash = childStub.stubHash;

        const secondAncestors = this.internalCalculateBreeders(
            secondParent,
            options,
        );
        secondParent.childHash = childStub.stubHash;

        // Generate return values.
        const parents = {
            // As assignment need to satisfy enum constraint.
            [firstParentGender as Gender.MALE]: firstParent,
            [secondParentGender as Gender.FEMALE]: secondParent,
        };

        childStub.parents = {
            [Gender.MALE]: parents.male.stubHash,
            [Gender.FEMALE]: parents.female.stubHash,
        };

        const allParents = [
            firstParent,
            ...firstAncestors.allParents,
            secondParent,
            ...secondAncestors.allParents,
        ];

        return { parents, allParents };
    }

    private makeBreedingStub(
        stub: Pick<
            IPokemonBreederStub,
            | "allowedIdentifiers"
            | "gender"
            | "ivs"
            | "nature"
            | "generation"
            | "forcedIdentifier"
        >,
    ): IPokemonBreederStub {
        const id =
            PokemonBuilder.ivRequirementsAsString(stub.ivs) +
            "-" +
            stub.gender +
            "-" +
            stub.nature +
            "-" +
            stub.allowedIdentifiers.sort().join(",");

        return {
            ...stub,
            parents: null,
            childHash: null,
            stubID: uuidv4(),
            stubHash: "stub-" + hashString(id).toString(),
            attachedPokemonID: null,
        };
    }

    /**
     * Get the most expensive stat/gender combo.
     */
    private getMostExpensiveStatGender(ivs: IVRequirements) {
        const mostExpMaleStat = this.mostExpensiveStat(ivs, Gender.MALE);
        const mostExpFemaleStat = this.mostExpensiveStat(ivs, Gender.FEMALE);

        if (!mostExpMaleStat || !mostExpFemaleStat) {
            return null;
        }

        if (
            this.getPriceForStat(ivs, mostExpMaleStat, Gender.MALE) >
            this.getPriceForStat(ivs, mostExpFemaleStat, Gender.FEMALE)
        ) {
            return {
                stat: mostExpMaleStat,
                gender: Gender.MALE,
            };
        } else {
            return {
                stat: mostExpFemaleStat,
                gender: Gender.FEMALE,
            };
        }
    }

    /**
     * Look into a pokemons info and find the price for a stat/gender combo.
     */
    private getPriceForStat(
        ivs: IVRequirements,
        stat: Stat,
        gender: Gender,
    ): number {
        return (
            ivs[stat].prices[gender] ?? PokemonBuilder.AVERAGE_UNDEFINED_PRICE
        );
    }

    /**
     * Find the most expensive stat out of some requirements for a particular gender.
     */
    private mostExpensiveStat(
        ivs: IVRequirements,
        gender: Gender,
    ): Stat | null {
        let mostExpensiveIV: Stat | null = null;
        let mostExpensiveIVPrice: number = 0;

        for (const [stat, info] of Object.entries(ivs)) {
            if (info.value === 0) {
                continue;
            }
            const price =
                info?.prices?.[gender] ||
                PokemonBuilder.AVERAGE_UNDEFINED_PRICE;
            if (price >= mostExpensiveIVPrice) {
                mostExpensiveIVPrice = price;
                mostExpensiveIV = stat as Stat;
            }
        }

        return mostExpensiveIV;
    }
}
