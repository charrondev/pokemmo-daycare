/**
 * Class for holding IVs.
 */

class IVGroup {
    public static MAX_VALUE = 31;
    public static MIN_VALUE = 0;

    public constructor(
        public hp: number,
        public attack: number,
        public defense: number,
        public spAttack: number,
        public spDefense: number,
        public speed: number
    ) {}
}
