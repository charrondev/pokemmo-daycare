/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { PokemonFactory } from "./PokemonFactory";
import { Gender } from "./IVUtils";
import { Naughty } from "./natures";

describe("Pokemon", () => {
    it("has parents calculated", () => {
        const pokemon = new Pokemon(
            {
                Attack: {
                    prices: {},
                },
                Defense: {
                    prices: {},
                },
            },
            Gender.FEMALE,
            null,
        );

        expect(pokemon.parents).not.toBe(null);
    });

    it("will ensure a correct nature/iv spread", () => {
        const pokemon = PokemonFactory.create(
            "charmander",
            {
                Attack: {
                    prices: {},
                },
                Defense: {
                    prices: {},
                },
            },
            Gender.FEMALE,
            Naughty,
        );

        // Female parent and grandparents.
        expect(pokemon.parents).not.toBe(null);
        expect(pokemon.parents?.female.nature).toBe(Naughty);
        expect(pokemon.parents?.female.ivRequirements.Attack).toBeDefined();
        expect(pokemon.parents?.female.parents).not.toBe(null);
        expect(
            pokemon.parents?.female.parents?.male.ivRequirements.Attack,
        ).not.toBe(null);
        expect(pokemon.parents?.female.parents?.female.nature).toBe(Naughty);
        expect(
            pokemon.parents?.female.parents?.female.ivRequirements.Attack,
        ).not.toBeDefined();

        // Male parent and grandparents.
        expect(pokemon.parents?.male.ivRequirements.Attack).toBeDefined();
        expect(pokemon.parents?.male.ivRequirements.Defense).toBeDefined();
        expect(
            pokemon.parents?.male.parents?.female.ivRequirements.Attack,
        ).toBeDefined();
        expect(
            pokemon.parents?.male.parents?.male.ivRequirements.Defense,
        ).toBeDefined();
    });

    it("will try to stay away from repeating expensive gender stats", () => {
        const pokemon = new Pokemon(
            {
                Attack: {
                    prices: {
                        male: 40000,
                        female: 10000,
                    },
                },
                Defense: {
                    prices: {},
                },
            },
            Gender.FEMALE,
            Naughty,
        );

        // Expectations are flipped from the previous test.
        expect(pokemon.parents).not.toBe(null);
        expect(pokemon.parents?.male.nature).toBe(Naughty);
        expect(pokemon.parents?.male.ivRequirements.Defense).toBeDefined();
        expect(pokemon.parents?.female.ivRequirements.Attack).toBeDefined();
        expect(pokemon.parents?.female.ivRequirements.Defense).toBeDefined();
    });
});
