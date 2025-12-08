import isMatchRowCompleted from "#lib/isMatchRowCompleted";
import ok from "#lib/ok";
import { getPlayerStats } from "@tttc/appscript/lib/getPlayerStats";
import getPoolRankings from "@tttc/appscript/lib/getPoolRankings";
import type { MatchRow, RosterRow } from "@tttc/appscript/types"
import PlayerChip from "./PlayerChip";
import useTournamentData from "#hooks/useTournamentData";

function getPoolPlayers(playerIndex: Map<string, RosterRow>, matches: MatchRow[]) {
	const ids = new Set<string>();
	for (const match of matches) {
		ids.add(match.idA);
		ids.add(match.idB);
	}

	const orderedIds = [...ids].map(val => {
		const player = playerIndex.get(val);
		ok(player);
		return player;
	}).sort((a, b) => {
		return b.rating - a.rating;
	}).map(val => {
		return val.id
	})

	return orderedIds;
}

export default function PoolPlayers({ matches }: { matches: MatchRow[] }) {
	const { playerIndex } = useTournamentData();

	const poolComplete = matches.every(isMatchRowCompleted);
	const orderedIds = poolComplete ? getPoolRankings(matches) : getPoolPlayers(playerIndex, matches);
	const playerStats = getPlayerStats(matches);
	const orderedPlayers = orderedIds.map(val => {
		const player = playerStats.get(val);
		ok(player);
		return player;
	});

	return (
		<article className="poolPlayers">
			<h4>{poolComplete ? "Complete" : "In Progress" }</h4>
			<table>
				<thead>
					<tr>
						{
							poolComplete &&
							<th>Rank</th>
						}
						<th>Name</th>
						<th>Matches Won</th>
						<th>Matches Lost</th>
						<th>Games Won</th>
						<th>Games Lost</th>
					</tr>
				</thead>
				<tbody>
					{
						orderedPlayers.map((val, i) => {
							return (
								<tr key={val.id}>
									{
										poolComplete &&
										<td>{i + 1}</td>
									}
									<td><PlayerChip id={val.id}/></td>
									<td>{val.matchWins}</td>
									<td>{val.matchLosses}</td>
									<td>{val.gameWins}</td>
									<td>{val.gameLosses}</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</article>
	)
}
