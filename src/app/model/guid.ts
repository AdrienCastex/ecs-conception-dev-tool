
export function guid() {
    return Math.random().toString().substring(2) + Date.now().toString();
}
