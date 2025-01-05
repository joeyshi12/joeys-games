export function clamp(value: number, lowerBound: number, upperBound: number): number {
    return Math.max(lowerBound, Math.min(upperBound, value));
}
