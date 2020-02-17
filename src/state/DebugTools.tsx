/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import { clear } from "redux-localstorage-simple";
import styled from "styled-components";
import Button from "@atlaskit/button";

const DebugToolsRoot = styled.div`
    position: fixed;
    top: 12px;
    right: 12px;
    right: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

export function DebugTools() {
    return (
        <DebugToolsRoot>
            <Button
                onClick={() => {
                    clear();
                    window.location.href = "/";
                }}
            >
                Clear App Cache
            </Button>
        </DebugToolsRoot>
    );
}
