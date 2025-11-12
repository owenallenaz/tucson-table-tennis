import createPlayerVector from "src/createPlayerVector.js";
import { testArray, type TestDef } from "@simpleview/mochalib";
import { deepStrictEqual } from "assert";
import type { PlayerVector } from "src/types.js";

describe(__filename, function() {
	interface Test {
		players: string[]
		result: PlayerVector
	}

	const tests: TestDef<Test>[] = [
		{
			name: "4 player",
			args: {
				players: ["1", "2", "3", "4"],
				result: [
					["1", "2"],
					["4", "3"]
				]
			}
		},
		{
			name: "5 player",
			args: {
				players: ["1", "2", "3", "4", "5"],
				result: [
					["1", "2", "3"],
					["bye", "5", "4"]
				]
			}
		},
		{
			name: "6 player",
			args: {
				players: ["1", "2", "3", "4", "5", "6"],
				result: [
					["1", "2", "3"],
					["6", "5", "4"]
				]
			}
		}
	]

	testArray(tests, function(test) {
		const result = createPlayerVector(test.players);
		deepStrictEqual(result, test.result);
	});
});
