import getVectorMatches from "src/getVectorMatches.js";
import { testArray, type TestDef } from "@simpleview/mochalib";
import { deepStrictEqual } from "assert";
import type { Match, PlayerVector } from "src/types.js";

describe(__filename, function() {
	interface Test {
		players: PlayerVector
		result: Match[]
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
					["2", "3"]
				]
			}
		},
		{
			name: "5 player",
			args: {
				players: [
					["1", "2", "3"],
					["bye", "5", "4"]
				],
				result: [
					["2", "5"],
					["3", "4"]
				]
			}
		},
		{
			name: "6 player",
			args: {
				players: [
					["1", "2", "3"],
					["6", "5", "4"]
				],
				result: [
					["1", "6"],
					["2", "5"],
					["3", "4"]
				]
			}
		},
		{
			name: "7 player",
			args: {
				players: [
					["1", "2", "3", "4"],
					["bye", "7", "6", "5"]
				],
				result: [
					["2", "7"],
					["3", "6"],
					["4", "5"]
				]
			}
		},
		{
			name: "8 player",
			args: {
				players: [
					["1", "2", "3", "4"],
					["8", "7", "6", "5"]
				],
				result: [
					["1", "8"],
					["2", "7"],
					["3", "6"],
					["4", "5"]
				]
			}
		}
	]

	testArray(tests, function(test) {
		const result = getVectorMatches(test.players);
		deepStrictEqual(result, test.result);
	});
});
