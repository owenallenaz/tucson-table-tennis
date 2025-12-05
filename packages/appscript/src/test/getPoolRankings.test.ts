import getPoolRankings from "src/getPoolRankings.js";
import { testArray, type TestDef } from "@simpleview/mochalib";
import { deepStrictEqual } from "assert";
import type { MatchRowCompleted } from "src/types.js";

function getMatch(row, idA, aWins, idB, bWins) {
	return {
		row,
		completed: true,
		pool: "A",
		winner: aWins > bWins ? idA : idB,
		loser: aWins > bWins ? idB : idA,
		idA,
		idB,
		aWins,
		bWins
	}
}

describe.only(__filename, function() {
	interface Test {
		matches: MatchRowCompleted[]
		result: string[]
	}

	const tests: TestDef<Test>[] = [
		{
			name: "2 player",
			args: {
				matches: [
					getMatch(1, "a", 3, "b", 1)
				],
				result: [
					"a",
					"b"
				]
			}
		},
		{
			name: "2 player reverse",
			args: {
				matches: [
					getMatch(1, "a", 1, "b", 3)
				],
				result: [
					"b",
					"a"
				]
			}
		},
		{
			name: "2 player with head to head tie decided by games",
			args: {
				matches: [
					getMatch(1, "a", 3, "b", 1),
					getMatch(2, "a", 0, "b", 3)
				],
				result: [
					"b",
					"a"
				]
			}
		},
		{
			name: "3 player with tie and head to head",
			args: {
				matches: [
					getMatch(1, "a", 3, "b", 1),
					getMatch(2, "b", 3, "c", 2),
					getMatch(3, "c", 3, "a", 1)
				],
				result: [
					"c",
					"a",
					"b"
				]
			}
		},
		{
			name: "4 player with no ties",
			args: {
				matches: [
					getMatch(1, "a", 3, "b", 0),
					getMatch(1, "a", 1, "c", 3),
					getMatch(1, "a", 0, "d", 3),
					getMatch(1, "b", 2, "c", 3),
					getMatch(1, "b", 1, "d", 3),
					getMatch(1, "c", 2, "d", 3),
				],
				result: [
					"d",
					"c",
					"a",
					"b"
				]
			}
		},
		{
			name: "5 player with 3-way tie",
			args: {
				matches: [
					getMatch(1, "a", 3, "b", 0),
					getMatch(1, "a", 3, "c", 0),
					getMatch(1, "a", 0, "d", 3),
					getMatch(1, "a", 0, "e", 3),
					getMatch(1, "b", 3, "c", 0),
					getMatch(1, "b", 0, "d", 3),
					getMatch(1, "b", 3, "e", 0),
					getMatch(1, "c", 3, "d", 0),
					getMatch(1, "c", 3, "e", 0),
					getMatch(1, "d", 3, "e", 0)
				],
				result: [
					"d",
					"a",
					"b",
					"c",
					"e"
				]
			},
		}
	]

	testArray(tests, function(test) {
		const result = getPoolRankings(test.matches);
		deepStrictEqual(result, test.result);
	});
});
