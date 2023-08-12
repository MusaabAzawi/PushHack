export function parseStringToFloat(string: string): number {
    return parseFloat(string.substring(0, Math.min(string.length, string.indexOf('.') + 5)));
}
