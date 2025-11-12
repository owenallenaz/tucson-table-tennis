import createPlayerVector from "./createPlayerVector.js";
import getVectorMatches from "./getVectorMatches.js";
import rotateVector from "./rotateVector.js";
import type { Match } from "./types.js";

/** For an array of player ids calculate all matches in the order they should be played */
export default function calculateMatches(ids: string[]): Match[] {
	let vector = createPlayerVector(ids);
	const matchCount = (ids.length / 2) * (ids.length - 1);

	const allMatches: Match[] = [];

	while (allMatches.length < matchCount) {
		const matches = getVectorMatches(vector);
		allMatches.push(...matches);
		vector = rotateVector(vector);
	}

	// sort the matches so that the match itself is listed in low-seed order
	const sortedMatches: Match[] = allMatches.map((val) => {
		const playerAIndex = ids.indexOf(val[0]);
		const playerBIndex = ids.indexOf(val[1]);

		if (playerAIndex < playerBIndex) {
			return [val[0], val[1]];
		} else {
			return [val[1], val[0]];
		}
	});

	return sortedMatches;
}
