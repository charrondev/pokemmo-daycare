/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ButtonType, FormButton } from "@pokemmo/form/FormButton";
import { PageLayout } from "@pokemmo/layout/PageLayout";
import React from "react";
import { clear } from "redux-localstorage-simple";

export function HelpPage() {
    return (
        <PageLayout
            content={
                <div>
                    <h2>Help & Debugging</h2>
                    <p>
                        This software is currently{" "}
                        <strong>Alpha Quality.</strong>As a result the only
                        support offered is to reset all state.
                    </p>
                    <FormButton
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => {
                            clear();
                            window.location.href = "/";
                        }}
                    >
                        Clear All Data
                    </FormButton>
                </div>
            }
        />
    );
}
