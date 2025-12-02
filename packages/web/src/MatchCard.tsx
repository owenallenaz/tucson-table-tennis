import type { MatchRow, RosterRow } from "@tttc/appscript/types";
import PlayerChip from "./PlayerChip";
import useAppData from "./useAppData";
import ok from "./ok";
import { calculatePoints } from "usatt-ratings";

interface PlayerWin {
	player: RosterRow
	wins?: number
}

export default function MatchCard({ match }: { match: MatchRow }) {
	const appData = useAppData();
	const playerA = appData.playerIndex.get(match.idA);
	ok(playerA);
	const playerB = appData.playerIndex.get(match.idB);
	ok(playerB);

	const first: PlayerWin = playerA.rating >= playerB.rating ? { player: playerA, wins: match.aWins } : { player: playerB, wins: match.bWins };
	const second: PlayerWin = first.player === playerA ? { player: playerB, wins: match.bWins } : { player: playerA, wins: match.aWins };

	return (
		<article>
			<div>
				<PlayerChip id={first.player.id}/>
				<span className="vs">vs</span>
				<PlayerChip id={second.player.id}/>
			</div>
			<MatchScore first={first} second={second}/>
		</article>
	)
}

function MatchScore({ first, second }: { first: PlayerWin, second: PlayerWin }) {
	if (first.wins === undefined || second.wins === undefined) {
		return null;
	}

	const winner = first.wins > second.wins ? first : second;
	const loser = winner === first ? second : first;
	const delta = calculatePoints(winner.player.rating, loser.player.rating);
	const firstDelta = `${first.player.rating} ${winner === first ? "+" : "-"}${delta}`;
	const secondDelta = `${second.player.rating} ${winner === second ? "+" : "-"}${delta}`;

	return (
		<div className="score">
			<span>{first.wins} - {second.wins}</span>
			<span className="ratingDelta">(tenative rating: {firstDelta}, {secondDelta})</span>
		</div>
	)
}
