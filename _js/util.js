export function resolveErrorToMessage(e) {
    e = e.message;
    return e.includes("Error:") ? e : "Error: " + e;
}