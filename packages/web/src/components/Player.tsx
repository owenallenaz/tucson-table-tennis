import { useParams } from "react-router";
import MatchCard from "./MatchCard";
import ok from "#lib/ok";
import useTournamentData from "#hooks/useTournamentData";
import BackButton from "./BackButton";

export default function Player() {
	const { matches, playerIndex } = useTournamentData();
	const { player: playerId } = useParams();
	ok(playerId);

	const poolMatches = matches.filter(val => val.idA === playerId || val.idB === playerId);
	const player = playerIndex.get(playerId);
	ok(player);

	return (
		<div className="pool">
			<BackButton to="../"/>
			<h3>Player - {player.name}</h3>
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
	)
}
