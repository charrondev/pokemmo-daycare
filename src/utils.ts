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
    separator = "."
) {
    const parts = key.split(separator);
    const last = parts.pop();

    if (!last) {
        throw new Error(
            `Unable to set meta value ${key}. ${last} is not a valid object key.`
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
