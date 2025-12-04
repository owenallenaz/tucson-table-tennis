import type { MatchRow } from "@tttc/appscript/types";
import useTournamentData from "./useTournamentData";
import ok from "#lib/ok";

export default function useMatchPlayers(match: MatchRow) {
	const tournamentData = useTournamentData();
	const playerA = tournamentData.playerIndex.get(match.idA);
	ok(playerA);
	const playerB = tournamentData.playerIndex.get(match.idB);
	ok(playerB);

	return {
		playerA,
		playerB,
		winner: match.idA === playerA.id ? playerA : playerB,
		loser: match.idA === playerA.id ? playerB : playerA,
		first: playerA.rating >= playerB.rating ? playerA : playerB,
		second: playerA.rating >= playerB.rating ? playerB : playerA
	}
}
