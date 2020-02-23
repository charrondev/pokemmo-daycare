/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { PageLayout } from "@pokemmo/layout/PageLayout";
import { clear } from "redux-localstorage-simple";
import { FormButton, ButtonType } from "@pokemmo/form/FormButton";

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
                        Clear App Cache
                    </FormButton>
                </div>
            }
        />
    );
}
