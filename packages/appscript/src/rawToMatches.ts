import cleanString from "./cleanString.js";
import cleanNumber from "./cleanNumber.js";
import type { MatchRow } from "./types.js";

export default function rawToMatches(raw: string[][]): MatchRow[] {
	const rows: MatchRow[] = [];

	for (const val of raw) {
		const pool = cleanString(val[0]);
		const idA = cleanString(val[1]);
		const idB = cleanString(val[2]);
		const aWins = cleanNumber(val[3]);
		const bWins = cleanNumber(val[4]);

		if (
			pool === undefined
			|| idA === undefined
			|| idB === undefined
		) {
			continue;
		}

		rows.push({
			pool,
			idA,
			idB,
			aWins,
			bWins
		});
	}

	return rows;
}
