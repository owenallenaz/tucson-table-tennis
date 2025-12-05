import type { MatchRow } from "@tttc/appscript/types";
import useTournamentData from "./useTournamentData";
import ok from "#lib/ok";
import { calculatePoints } from "usatt-ratings";

export default function useMatchPlayers(match: MatchRow) {
	const tournamentData = useTournamentData();
	const playerA = tournamentData.playerIndex.get(match.idA);
	ok(playerA);
	const playerB = tournamentData.playerIndex.get(match.idB);
	ok(playerB);

	const first = playerA.rating >= playerB.rating ? playerA : playerB;
	const second = playerA.rating >= playerB.rating ? playerB : playerA;
	const firstWins = first.id === match.idA ? match.aWins : match.bWins;
	const secondWins = first.id === match.idA ? match.bWins : match.aWins;
	const winner = match.completed ? first.id === match.winner ? first : second : undefined;
	const loser = match.completed ? first.id === match.winner ? second : first : undefined;
	const delta = winner && loser ? calculatePoints(winner.rating, loser.rating) : undefined;
	const firstDelta = delta !== undefined ? first.id === match.winner ? `+${delta}` : `-${delta}` : undefined;
	const secondDelta = delta !== undefined ? first.id === match.winner ? `-${delta}` : `+${delta}` : undefined;

	return {
		playerA,
		playerB,
		winner,
		loser,
		first,
		firstWins,
		firstDelta,
		second,
		secondWins,
		secondDelta
	}
}
