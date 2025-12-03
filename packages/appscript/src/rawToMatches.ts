import cleanString from "./cleanString.js";
import cleanNumber from "./cleanNumber.js";
import type { MatchRow } from "./types.js";

export default function rawToMatches(raw: string[][]): MatchRow[] {
	const rows: MatchRow[] = [];

	for (const [i, val] of Object.entries(raw)) {
		const pool = cleanString(val[0]);
		const idA = cleanString(val[1]);
		const idB = cleanString(val[3]);
		const aWins = cleanNumber(val[5]);
		const bWins = cleanNumber(val[6]);

		if (
			pool === undefined
			|| idA === undefined
			|| idB === undefined
		) {
			continue;
		}

		const completed = aWins !== undefined && bWins !== undefined;
		let winner: string | undefined;
		let loser: string | undefined;
		if (completed) {
			winner = aWins > bWins ? idA : idB;
			loser = winner === idA ? idB : idA;
		}

		rows.push({
			row: Number(i) + 2,
			pool,
			idA,
			idB,
			aWins,
			bWins,
			completed,
			winner,
			loser
		});
	}

	return rows;
}
