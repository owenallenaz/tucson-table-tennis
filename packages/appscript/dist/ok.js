export default function ok(value) {
    if (value === undefined) {
        throw new Error("Received undefined value");
    }
}
