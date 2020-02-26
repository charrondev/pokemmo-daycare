/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license MIT
 */

import { ActionCreatorsMapObject, bindActionCreators } from "@reduxjs/toolkit";
import { uniqueId } from "lodash-es";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

export function notEmpty<TValue>(
    value: TValue | null | undefined,
): value is TValue {
    return value !== null && value !== undefined;
}

/**
 * Set a piece of metadata. This will override what was passed from the server.
 *
 * @param key - The key to store under.
 * @param value - The value to set.
 */
export function setValue(
    target: any,
    key: string,
    value: any,
    separator = ".",
) {
    const parts = key.split(separator);
    const last = parts.pop();

    if (!last) {
        throw new Error(
            `Unable to set meta value ${key}. ${last} is not a valid object key.`,
        );
    }

    let haystack = target;

    for (const part of parts) {
        if (haystack[part] === null || typeof haystack[part] !== "object") {
            haystack[part] = {};
        }
        haystack = haystack[part];
    }
    haystack[last] = value;
}

/**
 * flatten an object into 1 level.
 */
export function flattenObject(value: any, joinCharacter = ".") {
    const toReturn: any = {};

    for (const i in value) {
        if (!value.hasOwnProperty(i)) continue;
        if (Array.isArray(value[i])) {
            toReturn[i] = value[i];
        } else if (typeof value[i] == "object") {
            const flatObject = flattenObject(value[i]);
            if (!value.hasOwnProperty(i)) continue;
            for (const x in flatObject) {
                toReturn[i + joinCharacter + x] = flatObject[x];
            }
        } else {
            toReturn[i] = value[i];
        }
    }
    return toReturn;
}

export function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function useActions<A, M extends ActionCreatorsMapObject<A>>(
    actions: M,
    deps?: any[],
): M {
    const dispatch = useDispatch();
    return useMemo(() => {
        return bindActionCreators(actions, dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, dispatch, deps]);
}

export function uppercaseFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.substring(1);
}

export function useUniqueID(prefix: string) {
    return useMemo(() => {
        return uniqueId(prefix);
    }, [prefix]);
}

export function numberWithCommas(x: string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
