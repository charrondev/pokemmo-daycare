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
            expect(breeders[0].parents).not.toBeNull();
            expect(breeders[0].childHash).toBeNull();

            // First breeder is for the target pokemon.
            expect(breeders[1].ivs.def.value).toBe(31);
            expect(breeders[1].ivs.hp.value).toBe(0);
            expect(breeders[1].gender).toBe(Gender.MALE);
            expect(breeders[1].generation).toBe(1);
            expect(breeders[1].parents).toBeNull();
            expect(breeders[1].childHash).not.toBeNull();

            // First breeder is for the target pokemon.
            expect(breeders[2].ivs.def.value).toBe(0);
            expect(breeders[2].ivs.hp.value).toBe(31);
            expect(breeders[2].gender).toBe(Gender.FEMALE);
            expect(breeders[2].generation).toBe(1);
            expect(breeders[1].parents).toBeNull();
            expect(breeders[2].childHash).not.toBeNull();

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

        it("calculates the lowest priced stats", () => {
            const builder = PokemonBuilder.create("magikarp")
                .ivs(
                    IVBuilder.create()
                        .add(Stat.HP, {
                            value: 31,
                            prices: {
                                [Gender.FEMALE]: 5000,
                                [Gender.MALE]: 11000,
                            },
                        })
                        .add(Stat.SPECIAL_ATTACK, {
                            value: 31,
                            prices: {
                                [Gender.FEMALE]: 2500,
                                [Gender.MALE]: 4000,
                            },
                        })
                        .add(Stat.DEFENSE, {
                            value: 31,
                            prices: {
                                [Gender.FEMALE]: 5000,
                                [Gender.MALE]: 10000,
                            },
                        })
                        .result(),
                )
                .gender(Gender.FEMALE);
            const breeders = builder.calculateBreeders();

            expect(breeders).toHaveLength(7);

            const singleIVBreeders = breeders.filter(stub => {
                let count = 0;
                Object.values(stub.ivs).forEach(stat => {
                    if (stat.value === 31) {
                        count++;
                    }
                });

                return count === 1;
            });

            expect(singleIVBreeders).toHaveLength(4);

            const countSpecialAttack = singleIVBreeders.filter(
                stub => stub.ivs.spAtk.value === 31,
            ).length;
            const countHP = singleIVBreeders.filter(
                stub => stub.ivs.hp.value === 31,
            ).length;
            const countDefense = singleIVBreeders.filter(
                stub => stub.ivs.hp.value === 31,
            ).length;

            expect(countSpecialAttack).toEqual(2);
            expect(countHP).toEqual(1);
            expect(countDefense).toEqual(1);
        });
    });
});

function breedersForStatCount(count: number) {
    return 2 ** count - 1;
}
