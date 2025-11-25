import rotateVector from "src/rotateVector.js";
import { testArray, type TestDef } from "@simpleview/mochalib";
import { deepStrictEqual } from "assert";
import type { PlayerVector } from "src/types.js";

describe(__filename, function() {
	interface Test {
		players: PlayerVector
		result: PlayerVector
	}

	const tests: TestDef<Test>[] = [
		{
			name: "4 player",
			args: {
				players: [
					["1", "2"],
					["4", "3"]
				],
				result: [
					["1", "4"],
					["3", "2"]
				]
			}
		},
		{
			name: "6 player",
			args: {
				players: [
					["1", "2", "3"],
					["4", "5", "6"]
				],
				result: [
					["1", "4", "2"],
					["5", "6", "3"]
				]
			}
		},
		{
			name: "8 player",
			args: {
				players: [
					["1", "2", "3", "4"],
					["5", "6", "7", "8"]
				],
				result: [
					["1", "5", "2", "3"],
					["6", "7", "8", "4"]
				]
			}
		}
	]

	testArray(tests, function(test) {
		const result = rotateVector(test.players);
		deepStrictEqual(result, test.result);
	});
});
