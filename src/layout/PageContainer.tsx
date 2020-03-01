/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import styled from "@emotion/styled";
import { containerSize } from "@pokemmo/styles/variables";

export const pageContainerPadding = 32;

export const PageContainer = styled.div`
    max-width: ${containerSize}px;
    padding: 0 32px;
    margin: 0 auto;
    width: 100%;

    @media screen and (max-width: 600px) {
        padding: 0 16px;
    }
`;
