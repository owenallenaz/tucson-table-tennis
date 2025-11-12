import calculateMatches from "src/calculateMatches.js";
import { testArray, type TestDef } from "@simpleview/mochalib";
import { deepStrictEqual } from "assert";
import type { Match } from "src/types.js";

describe(__filename, function() {
	interface Test {
		players: string[]
		result: Match[]
	}

	const tests: TestDef<Test>[] = [
		{
			name: "4 player",
			args: {
				players: ["1", "2", "3", "4"],
				result: [
					["1", "4"],
					["2", "3"],
					["1", "3"],
					["2", "4"],
					["1", "2"],
					["3", "4"]
				]
			}
		},
		{
			name: "5 player",
			args: {
				players: ["1", "2", "3", "4", "5"],
				result: [
					["2", "5"],
					["3", "4"],
					["1", "5"],
					["2", "3"],
					["1", "4"],
					["3", "5"],
					["1", "3"],
					["2", "4"],
					["1", "2"],
					["4", "5"]
				]
			}
		},
		{
			name: "6 player",
			args: {
				players: ["1", "2", "3", "4", "5", "6"],
				result: [
					["1", "6"],
					["2", "5"],
					["3", "4"],
					["1", "5"],
					["4", "6"],
					["2", "3"],
					["1", "4"],
					["3", "5"],
					["2", "6"],
					["1", "3"],
					["2", "4"],
					["5", "6"],
					["1", "2"],
					["3", "6"],
					["4", "5"]
				]
			}
		}
	]

	testArray(tests, function(test) {
		const result = calculateMatches(test.players);
		deepStrictEqual(result, test.result);
	});
});
