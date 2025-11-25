import type { PlayerVector } from "./types.js";

/**
 * Convert an array of player ids into a player vector for match creation purposes
*/
export default function createPlayerVector(ids: string[]): PlayerVector {
	const newIds = [...ids];

	if (newIds.length % 2 === 1) {
		newIds.push("bye");
	}

	const topRow = newIds.splice(0, newIds.length / 2);

	return [topRow, newIds.reverse()];
}
