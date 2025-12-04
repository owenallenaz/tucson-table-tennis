export default function ok(value: unknown): asserts value {
	if (value === undefined) {
		throw new Error("Received undefined value");
	}
}
