import cleanString from "./cleanString.js";
import cleanNumber from "./cleanNumber.js";
import type { RosterRow } from "./types.js";

export default function rawToRoster(raw: string[][]): RosterRow[] {
	const roster: RosterRow[] = [];

	for (const val of raw) {
		const id = cleanString(val[0]);
		const name = cleanString(val[1]);
		const rating = cleanNumber(val[2]);
		const pool = cleanString(val[3]);

		if (id === undefined || name === undefined || rating === undefined) {
			continue;
		}

		roster.push({
			id,
			name,
			rating,
			pool
		});
	}

	return roster;
}
