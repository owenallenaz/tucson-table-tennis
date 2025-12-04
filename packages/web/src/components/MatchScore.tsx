import useTournamentData from "#hooks/useTournamentData";
import ok from "#lib/ok";
import type { MatchRowCompleted } from "@tttc/appscript/types";
import { calculatePoints } from "usatt-ratings";

export default function MatchScore({ first, second, match }: { first: string, second: string, match: MatchRowCompleted }) {
	const tournamentData = useTournamentData();

	const playerA = tournamentData.playerIndex.get(match.idA);
	ok(playerA);
	const playerB = tournamentData.playerIndex.get(match.idB);
	ok(playerB);
	const winner = tournamentData.playerIndex.get(match.winner);
	ok(winner);
	const loser = tournamentData.playerIndex.get(match.loser);
	ok(loser);

	const firstPlayer = match.idA === first ? playerA : playerB;
	const secondPlayer = match.idA === first ? playerB : playerA;
	const firstWins = match.idA === first ? match.aWins : match.bWins;
	const secondWins = match.idA === first ? match.bWins : match.aWins;

	const delta = calculatePoints(winner.rating, loser.rating);
	const firstDelta = `${firstPlayer.rating} ${winner.id === first ? "+" : "-"}${delta}`;
	const secondDelta = `${secondPlayer.rating} ${winner.id === first ? "-" : "+"}${delta}`;

	return (
		<div className="score">
			<span>{firstWins} - {secondWins}</span>
			<span className="ratingDelta">(tenative rating: {firstDelta}, {secondDelta})</span>
		</div>
	)
}
