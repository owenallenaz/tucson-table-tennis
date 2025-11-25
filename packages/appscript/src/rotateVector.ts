import type { PlayerVector } from "./types.js";

/** Rotate the player vector to get next rounds matches */
export default function rotateVector(vector: PlayerVector): PlayerVector {
	const row1 = [...vector[0]];
	const row2 = [...vector[1]];

	const fixed1 = row1.shift();
	const topRight = row1.pop();
	const bottomLeft = row2.shift();
	row1.unshift(bottomLeft);
	row1.unshift(fixed1);
	row2.push(topRight);

	return [row1, row2];
}
