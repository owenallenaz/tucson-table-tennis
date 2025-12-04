import { NavLink, useParams } from "react-router";
import MatchCard from "./MatchCard";
import useTournamentData from "#hooks/useTournamentData";
import BackButton from "./BackButton";

export default function Pool() {
	const { matches } = useTournamentData();
	const { pool: poolName } = useParams();

	const poolMatches = matches.filter(val => val.pool === poolName);
	console.log("myMatches", poolMatches);

	return (
		<div className="pool">
			<BackButton to="../"/>
			<h3>Pool - {poolName}</h3>
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
