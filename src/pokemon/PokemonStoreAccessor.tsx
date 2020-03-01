/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { pokemonSlice } from "@pokemmo/pokemon/pokemonSlice";
import { getStore } from "@pokemmo/state/store";
import { bindActionCreators } from "redux";

export class PokemonStoreAccessor {
    /**
     * Global redux store.
     */
    protected store = getStore();

    protected get pokemonStore() {
        return this.store.getState().pokemon;
    }

    /**
     * Pokemon actions from the redux store.
     */
    protected storeActions = bindActionCreators(
        pokemonSlice.actions,
        this.store.dispatch,
    );
}
