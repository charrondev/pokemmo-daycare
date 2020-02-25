/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { EMPTY_IV } from "@pokemmo/pokemon/IVUtils";
import {
    DEFAULT_PARENT_BUILDER_OPTIONS,
    IParentBuilderOptions,
    PokemonParentBuilder,
} from "@pokemmo/pokemon/PokemonParentBuilder";
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

/**
 * Builder pattern implementation for Pokemon.
 */
export class PokemonBuilder {
    private _identifier: string;
    private _uuid: string = uuidv4();
    private _id: string = this.calculateID();

    private parentBuilder = new PokemonParentBuilder();

    public constructor(pokemon: IPokemon);
    public constructor(identifier: string);
    public constructor(pokemonOrIdentfier: IPokemon | string) {
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
        this._parentIDs = this.parentBuilder.calculateParents(
            this.result(),
            options,
        );
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
        const id = `${this._identifier}-${this._gender}-${
            this.ivRequirementsAsString
        }-${this._nature ? this._nature + "-" : ""}${this._uuid}`;
        this._id = id;
        return id;
    }

    private ivRequirementsAsString(): string {
        const statNum = (stat: Stat) => {
            const statInfo = this._ivs[stat];
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
}
