import { useParams } from "react-router";
import MatchCard from "./MatchCard";
import ok from "#lib/ok";
import useTournamentData from "#hooks/useTournamentData";
import BackButton from "./BackButton";
import { getPlayerStats } from "@tttc/appscript/lib/getPlayerStats";
import PlayerChip from "./PlayerChip";
import Loading from "./Loading";

export default function Player() {
	const { matches, roster, isLoaded } = useTournamentData();
	const { player: playerId } = useParams();
	ok(playerId);

	const poolMatches = matches.filter(val => val.idA === playerId || val.idB === playerId);

	const playerStats = getPlayerStats(matches);
	const myStats = playerStats.get(playerId);
	const myRoster = roster.find(val => val.id === playerId);

	return (
		<div className="pool">
			<BackButton to="../"/>
			<Loading loading={!isLoaded}/>
			{
				isLoaded && myStats && myRoster &&
				<div>
					<div className="poolPlayers">
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Initial Rating</th>
									<th>New Rating</th>
									<th>Change</th>
									<th>Matches Won</th>
									<th>Matches Lost</th>
									<th>Games Won</th>
									<th>Games Lost</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{myRoster.name}</td>
									<td>{myRoster.rating}</td>
									<td>{myRoster.newRating}</td>
									<td>{myRoster.delta}</td>
									<td>{myStats.matchWins}</td>
									<td>{myStats.matchLosses}</td>
									<td>{myStats.gameWins}</td>
									<td>{myStats.gameLosses}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<h3>Matches</h3>
					<hr/>
					{
						poolMatches.map((val, i) => {
							return (
								<MatchCard key={i} match={val}/>
							)
						})
					}
				</div>
			}
		</div>
	)
}
