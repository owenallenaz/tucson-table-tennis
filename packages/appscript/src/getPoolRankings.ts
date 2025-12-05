import { getPlayerStats } from "./getPlayerStats.js";
import ok from "./ok.js";
import type { MatchRowCompleted, PlayerStats } from "./types.js";

function getSubMatches(players: string[], matches: MatchRowCompleted[]) {
	return matches.filter(val => players.includes(val.idA) && players.includes(val.idB));
}

function getWinBuckets(playerStats: Map<string, PlayerStats>) {
	const winBuckets = new Map<number, string[]>();
	for (const player of playerStats.values()) {
		const arr = winBuckets.get(player.matchWins) ?? [];
		arr.push(player.id);
		winBuckets.set(player.matchWins, arr);
	}

	return winBuckets;
}

function getGamesBuckets(playerStats: Map<string, PlayerStats>) {
	const buckets = new Map<number, string[]>();
	for (const player of playerStats.values()) {
		const arr = buckets.get(player.gameWins) ?? [];
		arr.push(player.id);
		buckets.set(player.gameWins, arr);
	}

	return buckets;
}

function resolveTwoWayTie(matches: MatchRowCompleted[]) {
	const playerStats = getPlayerStats(matches);

	return [...playerStats.values()].sort((a, b) => {
		return b.gameWins - a.gameWins;
	}).map(val => {
		return val.id;
	});
}

function resolveThreeWayTie(matches: MatchRowCompleted[]) {
	const playerStats = getPlayerStats(matches);
	const gameBuckets = getGamesBuckets(playerStats);

	const sortedPlayers: string[] = [];
	const winKeys = [...gameBuckets.keys()].sort((a, b) => b - a);
	for (const key of winKeys) {
		const players = gameBuckets.get(key);
		ok(players);

		if (players.length === 1) {
			sortedPlayers.push(players[0]);
		} else if (players.length === 2) {
			sortedPlayers.push(...resolveTwoWayTie(getSubMatches(players, matches)));
		} else {
			sortedPlayers.push(...players);
		}
	}

	return sortedPlayers;
}

export default function getPoolRankings(matches: MatchRowCompleted[]) {
	const playerStats = getPlayerStats(matches);
	const winBuckets = getWinBuckets(playerStats);

	const sortedPlayers: string[] = [];
	const winKeys = [...winBuckets.keys()].sort((a, b) => b - a);
	for (const key of winKeys) {
		const players = winBuckets.get(key);
		ok(players);

		if (players.length === 1) {
			sortedPlayers.push(players[0]);
		} else if (players.length === 2) {
			sortedPlayers.push(...resolveTwoWayTie(getSubMatches(players, matches)));
		} else if (players.length === 3) {
			sortedPlayers.push(...resolveThreeWayTie(getSubMatches(players, matches)));
		} else {
			sortedPlayers.push(...players);
		}
	}

	return sortedPlayers;
}
