import type { MatchRow } from "@tttc/appscript/types";
import PlayerChip from "./PlayerChip";
import ok from "#lib/ok";
import useTournamentData from "#hooks/useTournamentData";
import MatchScore from "./MatchScore";
import isMatchRowCompleted from "#lib/isMatchRowCompleted";
import useMatchPlayers from "#hooks/useMatchPlayers";
import { calculatePoints } from "usatt-ratings";

export default function MatchCard({ match }: { match: MatchRow }) {
	// const tournamentData = useTournamentData();
	const players = useMatchPlayers(match);
	// const playerA = tournamentData.playerIndex.get(match.idA);
	// ok(playerA);
	// const playerB = tournamentData.playerIndex.get(match.idB);
	// ok(playerB);

	// const first = playerA.rating >= playerB.rating ? playerA.id : playerB.id;
	// const second = playerA.rating >= playerB.rating ? playerB.id : playerA.id;

	let delta: number | undefined;
	let firstWins: number | undefined;
	let secondWins: number | undefined;
	let firstDelta: string | undefined;
	let secondDelta: string | undefined;
	if (match.completed) {
		delta = calculatePoints(players.winner.rating, players.loser.rating);
		firstWins = players.first.id === match.idA ? match.aWins : match.bWins;
		secondWins = players.first.id === match.idA ? match.bWins : match.aWins;
		firstDelta = players.winner === players.first ? `+${delta}` : `-${delta}`;
		secondDelta = players.winner === players.first ? `-${delta}` : `+${delta}`;
	}

	return (
		<article>
			<div>
				<PlayerChip id={players.first.id} wins={firstWins} delta={firstDelta}/>
				<span className="vs">vs</span>
				<PlayerChip id={players.second.id} wins={secondWins} delta={secondDelta}/>
			</div>
			{/* {
				isMatchRowCompleted(match) &&
				<MatchScore first={first} second={second} match={match}/>
			} */}
		</article>
	)
}
