import { NavLink, useParams } from "react-router";
import useAppData from "./useAppData";
import MatchCard from "./MatchCard";

export default function Pool() {
	const { matches } = useAppData();
	const { pool: poolName } = useParams();

	const poolMatches = matches.filter(val => val.pool === poolName);
	console.log("myMatches", poolMatches);

	return (
		<div className="pool">
			<NavLink to="/">Back</NavLink>
			<h2>Pool - {poolName}</h2>
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
