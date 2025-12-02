import { NavLink, useParams } from "react-router";
import useAppData from "./useAppData";
import MatchCard from "./MatchCard";
import ok from "./ok";

export default function Player() {
	const { matches, playerIndex } = useAppData();
	const { player: playerId } = useParams();
	ok(playerId);

	const poolMatches = matches.filter(val => val.idA === playerId || val.idB === playerId);
	const player = playerIndex.get(playerId);
	ok(player);

	return (
		<div className="pool">
			<NavLink to="/">Back</NavLink>
			<h2>Player - {player.name}</h2>
			<h2>Matches</h2>
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
