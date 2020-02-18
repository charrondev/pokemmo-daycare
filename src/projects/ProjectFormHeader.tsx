/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import React from "react";
import styled from "styled-components";

const FormHeader = styled.header`
    display: flex;
    align-items: flex-end;
    position: sticky;
    top: 0;
    z-index: 1;
    left: 0;
    right: 0;
    width: 100%;
    background: #f9fafb;
    margin: 0;
    padding: 12px 0;
    border-bottom: 1px solid lightgray;
`;

const Left = styled.div`
    display: flex
    align-items: center;

    > * {
        min-width: 200px;
    }
`;

const Right = styled.div`
    display: flex;
    justify-content: flex-end;
    flex: 1;
`;

export function ProjectFormHeader(props: {
    children?: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <FormHeader>
            <Left>{props.children}</Left>
            {props.right && <Right>{props.right}</Right>}
        </FormHeader>
    );
}
