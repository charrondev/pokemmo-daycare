/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { useActions } from "@pokemmo/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// These are put here instead of in the projectSlice to prevent circular dependencies.

type IStubAttachmentAction = PayloadAction<{
    projectID: string;
    pokemonID: string;
    stubHash: string;
    stubID?: string;
}>;

export const stubSlice = createSlice({
    name: "projectAttachments",
    initialState: {},
    reducers: {
        attachPokemonToStub: (state, action: IStubAttachmentAction) => {},
        detachPokemonFromStub: (state, action: IStubAttachmentAction) => {},
    },
});

export function useStubActions() {
    return useActions(stubSlice.actions);
}
