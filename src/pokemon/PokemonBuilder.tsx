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
    IVRequirements,
    OwnershipStatus,
    ParentIDs,
    Stat,
} from "@pokemmo/pokemon/PokemonTypes";
import { uuidv4 } from "@pokemmo/utils";
import { sample } from "lodash-es";

export interface IParentBuilderOptions {
    allowedAlts: string[];
}

export const DEFAULT_PARENT_BUILDER_OPTIONS: IParentBuilderOptions = {
    allowedAlts: [],
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
            this._parentIDs = pok.parentIDs;
            this._childID = pok.childID;
            this._projectIDs = pok.projectIDs;
            this._breedStatus = pok.breedStatus;
            this._ownershipStatus = pok.ownershipStatus;
            this._boughtPrice = pok.boughtPrice;
        }
    }

    public static create(identifier: string): PokemonBuilder {
        return new PokemonBuilder(identifier);
    }

    public static from(identifier: string): PokemonBuilder {
        const pokemon = new PokemonBuilder(identifier);

        return pokemon;
    }

    public result(): IPokemon {
        return {
            identifier: this._identifier,
            ivs: this._ivs,
            nature: this._nature,
            gender: this._gender,

            _uuid: this._uuid,
            id: this._id,
            parentIDs: this._parentIDs,
            childID: this._childID,

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

    private _childID: string | null = null;
    public childID(id: string | null) {
        this._childID = id;
        return this;
    }

    private _parentIDs: ParentIDs = null;
    public parentIDs(parentIDs: ParentIDs) {
        this._parentIDs = parentIDs;
        return this;
    }

    public calculateParents(
        options: IParentBuilderOptions = DEFAULT_PARENT_BUILDER_OPTIONS,
    ) {
        this._parentIDs = this.createParents(this.result(), options);
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
        }-${this.ivRequirementsAsString()}-${
            this._nature ? this._nature + "-" : ""
        }${this._uuid}`;
        this._id = id;
        return id;
    }

    private ivRequirementsAsString(): string {
        const statNum = (stat: Stat) => {
            const statInfo = this._ivs?.[stat];
            if (!statInfo) {
                return 0;
            } else {
                return statInfo.value ?? 31;
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

    /**
     * Calculate the parents for a pokemon.
     * @param pokemon The pokemon to calculate from.
     * @param options Breeding options.
     */
    private createParents(
        pokemon: IPokemon,
        options: IParentBuilderOptions = DEFAULT_PARENT_BUILDER_OPTIONS,
    ): ParentIDs {
        // This is the stat/gender that's most expensive.
        // It should be elimated first.
        const mostExpensive = this.getMostExpensiveStatGender(pokemon);
        const EMPTY_RESULT: ParentIDs = null;

        if (!mostExpensive) {
            return EMPTY_RESULT;
        }
        const sampledName = sample([
            pokemon.identifier,
            ...options.allowedAlts,
        ])!;
        let statCount = Object.keys(pokemon.ivs).length;
        const firstParentStat = mostExpensive.stat;
        const firstParentGender = swapGender(mostExpensive.gender);
        const firstParentIdentifier =
            firstParentGender === Gender.MALE
                ? sampledName
                : pokemon.identifier;
        const secondParentGender = mostExpensive.gender;
        const secondParentIdentifier =
            secondParentGender === Gender.MALE
                ? sampledName
                : pokemon.identifier;

        if (pokemon.nature) {
            if (statCount === 0) {
                return EMPTY_RESULT;
            }

            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.

            const firstParent = PokemonBuilder.create(firstParentIdentifier)
                .ivs(pokemon.ivs)
                .gender(firstParentGender)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            const secondParent = PokemonBuilder.create(secondParentIdentifier)
                .ivs(subtractIVRequirement(pokemon.ivs, firstParentStat))
                .gender(secondParentGender)
                .nature(pokemon.nature)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            // Stash the pokemon in the store.
            this.storeActions.addPokemon([firstParent, secondParent]);

            const parentIDs = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: firstParent.id,
                [secondParentGender as Gender.FEMALE]: secondParent.id,
            };

            return parentIDs;
        } else {
            if (statCount <= 1) {
                // Only 1 stat needed. Moving on.
                return EMPTY_RESULT;
            }

            // We have no nature specified. As a result, both pokemon targetted will have 1 less pokemon than before.
            // When targeting nature, we have to have a another pokemon with no nature, and all IVs.
            // In case of "perfect" pokemon, that means a 6IV non-nature and 5IV natured.

            const secondParentRequirements = subtractIVRequirement(
                pokemon.ivs,
                firstParentStat,
            );
            const secondParentStat = this.mostExpensiveStat(
                secondParentRequirements,
                secondParentGender,
            );

            if (!secondParentStat) {
                throw new Error("Shouldn't happen");
            }
            const firstParentIVs = subtractIVRequirement(
                pokemon.ivs,
                secondParentStat,
            );

            const firstParent = PokemonBuilder.create(firstParentIdentifier)
                .ivs(firstParentIVs)
                .gender(firstParentGender)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            const secondParent = PokemonBuilder.create(secondParentIdentifier)
                .ivs(secondParentRequirements)
                .gender(secondParentGender)
                .childID(pokemon.id)
                .projectIDs(pokemon.projectIDs)
                .calculateParents()
                .result();

            const parentIDs = {
                // As assignment need to satisfy enum constraint.
                [firstParentGender as Gender.MALE]: firstParent.id,
                [secondParentGender as Gender.FEMALE]: secondParent.id,
            };

            return parentIDs;
        }
    }

    /**
     * Get the most expensive stat/gender combo.
     */
    private getMostExpensiveStatGender(pokemon: IPokemon) {
        const mostExpMaleStat = this.mostExpensiveStat(
            pokemon.ivs,
            Gender.MALE,
        );
        const mostExpFemaleStat = this.mostExpensiveStat(
            pokemon.ivs,
            Gender.FEMALE,
        );

        if (!mostExpMaleStat || !mostExpFemaleStat) {
            return null;
        }

        if (
            this.getPriceForStat(pokemon, mostExpMaleStat, Gender.MALE) >
            this.getPriceForStat(pokemon, mostExpFemaleStat, Gender.FEMALE)
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
        pokemon: IPokemon,
        stat: Stat,
        gender: Gender,
    ): number {
        return (
            pokemon.ivs[stat].prices[gender] ??
            PokemonBuilder.AVERAGE_UNDEFINED_PRICE
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
        let mostExpensiveIVPrice: number =
            PokemonBuilder.AVERAGE_UNDEFINED_PRICE;

        for (const [stat, info] of Object.entries(ivs)) {
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
