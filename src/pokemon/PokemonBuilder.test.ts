/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { IVBuilder } from "@pokemmo/pokemon/IVUtils";
import { PokemonBuilder } from "@pokemmo/pokemon/PokemonBuilder";
import { Gender, Stat } from "@pokemmo/pokemon/PokemonTypes";

describe("PokemonBuilder", () => {
    describe("calculateBreeders", () => {
        describe("correct numbers of children", () => {
            const testCases = [
                [Stat.HP],
                [Stat.HP, Stat.DEFENSE],
                [Stat.HP, Stat.DEFENSE, Stat.ATTACK],
                [Stat.HP, Stat.DEFENSE, Stat.ATTACK, Stat.SPECIAL_ATTACK],
                [
                    Stat.HP,
                    Stat.DEFENSE,
                    Stat.ATTACK,
                    Stat.SPECIAL_ATTACK,
                    Stat.SPECIAL_DEFENSE,
                ],
                [
                    Stat.HP,
                    Stat.DEFENSE,
                    Stat.ATTACK,
                    Stat.SPECIAL_ATTACK,
                    Stat.SPECIAL_DEFENSE,
                    Stat.SPEED,
                ],
            ];

            testCases.forEach(stats => {
                it(`Calculates the correct number of children for ${stats.length} stats.`, () => {
                    const ivs = IVBuilder.maxedStats(stats);
                    const expectedCount = breedersForStatCount(stats.length);
                    const builder = PokemonBuilder.create("deino").ivs(ivs);
                    const breeders = builder.calculateBreeders();
                    expect(breeders).toHaveLength(expectedCount);
                });
            });
        });

        it("calculates properly in a simple setup", () => {
            const builder = PokemonBuilder.create("deino")
                .ivs(IVBuilder.maxedStats([Stat.HP, Stat.DEFENSE]))
                .gender(Gender.FEMALE);
            const breeders = builder.calculateBreeders();

            // First breeder is for the target pokemon.
            expect(breeders[0].ivs.def.value).toBe(31);
            expect(breeders[0].ivs.hp.value).toBe(31);
            expect(breeders[0].gender).toBe(Gender.FEMALE);
            expect(breeders[0].generation).toBe(0);

            // First breeder is for the target pokemon.
            expect(breeders[1].ivs.def.value).toBe(31);
            expect(breeders[1].ivs.hp.value).toBe(0);
            expect(breeders[1].gender).toBe(Gender.MALE);
            expect(breeders[1].generation).toBe(1);

            // First breeder is for the target pokemon.
            expect(breeders[2].ivs.def.value).toBe(0);
            expect(breeders[2].ivs.hp.value).toBe(31);
            expect(breeders[2].gender).toBe(Gender.FEMALE);
            expect(breeders[2].generation).toBe(1);

            breeders.forEach(breeder => {
                // No natures.
                expect(breeder.nature).toBeNull();
            });
        });

        it("handles alternative names and natures", () => {
            const nature = "TestNature";
            const builder = PokemonBuilder.create("main")
                .ivs(IVBuilder.maxedStats([Stat.HP, Stat.ATTACK]))
                .nature(nature)
                .gender(Gender.FEMALE);
            const breeders = builder.calculateBreeders({
                allowedIdentifiers: ["alt1", "alt2"],
            });
            const expectedAlts = ["alt1", "alt2", "main"];
            expect(breeders).toHaveLength(7);

            // No alternatives on the main breeder.
            expect(breeders[0].allowedIdentifiers).toEqual(["main"]);
            expect(breeders[0].nature).toEqual(nature);

            // All children of the male line allow alts.
            expect(breeders[1].gender).toEqual(Gender.MALE);
            expect(breeders[1].allowedIdentifiers).toEqual(expectedAlts);

            expect(breeders[2].gender).toEqual(Gender.MALE);
            expect(breeders[2].allowedIdentifiers).toEqual(expectedAlts);

            expect(breeders[3].gender).toEqual(Gender.FEMALE);
            expect(breeders[3].allowedIdentifiers).toEqual(expectedAlts);

            // Females in the female line don't allow alts.
            expect(breeders[4].gender).toEqual(Gender.FEMALE);
            expect(breeders[4].allowedIdentifiers).toEqual(["main"]);
            expect(breeders[4].nature).toEqual(nature);

            expect(breeders[5].gender).toEqual(Gender.MALE);
            expect(breeders[5].allowedIdentifiers).toEqual(expectedAlts);

            expect(breeders[6].gender).toEqual(Gender.FEMALE);
            expect(breeders[6].allowedIdentifiers).toEqual(["main"]);
            expect(breeders[6].nature).toEqual(nature);
        });
    });
});

function breedersForStatCount(count: number) {
    return 2 ** count - 1;
}
