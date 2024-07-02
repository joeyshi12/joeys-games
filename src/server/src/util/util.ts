export function isNumberArray(maybeArray: any): boolean {
    if (!Array.isArray(maybeArray)) {
        return false;
    }
    for (const item of maybeArray) {
        if (typeof item !== "number") {
            return false;
        }
    }
    return true;
}
