// /**
//  * @copyright 2020 Adam (charrondev) Charron
//  * @license MIT
//  */

import { PokemonForm } from "@pokemmo/pokemon/PokemonForm";
import {
    useProjectActions,
    useProjectCount,
} from "@pokemmo/projects/projectHooks";
import { IProject } from "@pokemmo/projects/projectsSlice";
import { uuidv4 } from "@pokemmo/utils";
import { Dialog } from "@reach/dialog";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export function useForceUpdate() {
    const [, setTick] = useState(0);
    const update = useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

interface IProps extends React.ComponentProps<typeof Dialog> {}

export function ProjectForm(props: IProps) {
    const history = useHistory();
    const projectCount = useProjectCount();
    const { addProject } = useProjectActions();
    return (
        <PokemonForm
            {...props}
            isProject
            afterSubmit={pokemon => {
                const project: IProject = {
                    projectName: `Project ${projectCount + 1}`,
                    projectID: uuidv4(),
                    targetPokemonID: pokemon.id,
                    breederPokemonIDs: [],
                    dateCreated: new Date().toISOString(),
                    dateUpdated: new Date().toISOString(),
                };
                addProject({ project });
                history.push(`/projects/${project.projectID}`);
            }}
        />
    );
}
