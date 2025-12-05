import type { MatchRow, PlayerStats } from "./types.js";

export function getPlayerStats(matches: MatchRow[]) {
	const playerStats = new Map<string, PlayerStats>();
	for (const match of matches) {
		const playerA: PlayerStats = playerStats.get(match.idA) ?? { id: match.idA, matchWins: 0, matchLosses: 0, gameWins: 0, gameLosses: 0 };
		const playerB: PlayerStats = playerStats.get(match.idB) ?? { id: match.idB, matchWins: 0, matchLosses: 0, gameWins: 0, gameLosses: 0 };

		playerA.gameWins += match.aWins ?? 0;
		playerA.gameLosses += match.bWins ?? 0;
		playerA.matchWins += match.idA === match.winner ? 1 : 0;
		playerA.matchLosses += match.idA === match.loser ? 1 : 0;
		playerB.gameWins += match.bWins ?? 0;
		playerB.gameLosses += match.aWins ?? 0;
		playerB.matchWins += match.idB === match.winner ? 1 : 0;
		playerB.matchLosses += match.idB === match.loser ? 1 : 0;
		playerStats.set(match.idA, playerA);
		playerStats.set(match.idB, playerB);
	}

	return playerStats;
}
