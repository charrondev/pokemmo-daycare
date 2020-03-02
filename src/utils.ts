/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license GPL-3.0-only
 */

import { ActionCreatorsMapObject, bindActionCreators } from "@reduxjs/toolkit";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { debounce, uniqueId } from "lodash-es";
import queryString from "query-string";
import {
    RefObject,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ResizeObserver from "resize-observer-polyfill";

export function relativeTime(date: string | Date) {
    return formatDistanceToNow(new Date(date));
}

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

/**
 * Get a version of the query string object with only keys that have values.
 */
function getFilteredValue<T extends object>(
    inputValue: T,
    defaults: T,
): Partial<T> {
    let filteredValue: Partial<T> = {};

    for (const [key, value] of Object.entries(inputValue)) {
        if (value === null || value === undefined || value === "") {
            continue;
        }

        if ((defaults as any)[key] === value) {
            continue;
        }

        (filteredValue as any)[key] = value;
    }

    return filteredValue;
}
export function useQueryParamsSync<T extends Object>(
    currentValue: T,
    defaults: T,
) {
    const history = useHistory();

    const tryUpdateQuery = useCallback(
        debounce((currentValue: T) => {
            const currentQueryString = history.location.search;
            // debugger;
            const filteredQueryObj = getFilteredValue(currentValue, defaults);
            const filteredQueryString = queryString.stringify(filteredQueryObj);

            if (currentQueryString !== "?" + filteredQueryString) {
                history.replace({
                    ...history.location,
                    search: filteredQueryString,
                });
            }
        }, 150),
        [history, defaults],
    );

    useEffect(() => {
        tryUpdateQuery(currentValue);
    });
}

// DOMRectReadOnly.fromRect()
export const EMPTY_RECT: DOMRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    toJSON: () => "",
};

/**
 * Utility hook for measuring a dom element.
 * Will return back measurements as a bounding rectangle for the element contained in a ref.
 */
export function useMeasure(
    ref: RefObject<HTMLElement | null>,
    adjustForScrollOffset: boolean = false,
) {
    const [bounds, setContentRect] = useState<DOMRect>(EMPTY_RECT);

    useLayoutEffect(() => {
        let animationFrameId: number | null = null;

        const measure = () => {
            animationFrameId = window.requestAnimationFrame(() => {
                if (!ref.current) {
                    return;
                }
                let rect = ref.current.getBoundingClientRect();

                if (adjustForScrollOffset) {
                    rect = {
                        ...rect,
                        y: rect.y + window.scrollY,
                        top: rect.top + window.scrollY,
                        bottom: rect.bottom + window.scrollY,
                        width: rect.width,
                        height: rect.height,
                        right: rect.right,
                        left: rect.left,
                    };
                }

                setContentRect(rect);
            });
        };

        const resizeListener = debounce(() => {
            measure();
        }, 100);
        window.addEventListener("resize", resizeListener);

        const ro = new ResizeObserver(measure);
        if (ref.current) {
            ro.observe(ref.current);
        }

        return () => {
            window.cancelAnimationFrame(animationFrameId!);
            ro.disconnect();
            resizeListener.cancel();
            window.removeEventListener("resize", resizeListener);
        };
    }, [adjustForScrollOffset, ref]);

    return bounds;
}

/**
 * A simple, fast method of hashing a string. Similar to Java's hash function.
 * https://stackoverflow.com/a/7616484/1486603
 *
 * @param str - The string to hash.
 *
 * @returns The hash code returned.
 */
export function hashString(str: string): number {
    function hashReduce(prevHash: number, currVal: string) {
        // tslint:disable-next-line:no-bitwise
        return (prevHash << 5) - prevHash + currVal.charCodeAt(0);
    }
    return str.split("").reduce(hashReduce, 0);
}
