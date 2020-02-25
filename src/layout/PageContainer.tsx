/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import styled from "@emotion/styled";
import { containerSize } from "@pokemmo/styles/variables";

export const PageContainer = styled.div`
    max-width: ${containerSize}px;
    padding: 0 32px;
    margin: 0 auto;

    @media screen and (max-width: 600px) {
        padding: 0 16px;
    }
`;
