/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { PageLayout } from "@pokemmo/layout/PageLayout";

interface IProps {}

export function PokemonPage() {
    return (
        <PageLayout
            content={<div>Hello Pokemon Page</div>}
            subNav={<div>Hello subnav</div>}
        />
    );
}
