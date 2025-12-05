import { useParams } from "react-router";
import MatchCard from "./MatchCard";
import useTournamentData from "#hooks/useTournamentData";
import BackButton from "./BackButton";
import Loading from "./Loading";
import PoolPlayers from "./PoolPlayers";
import Button from "./Button";

export default function Pool() {
	const { matches, isFetching, isFetchingMatches, reloadMatches } = useTournamentData();
	const { pool: poolName } = useParams();

	const poolMatches = matches.filter(val => val.pool === poolName);

	return (
		<div className="pool">
			<BackButton to="../"/>
			<Loading loading={isFetching}/>
			{
				!isFetching &&
				<div>
					<h3>Pool - {poolName}</h3>
					<Button onClick={reloadMatches} busy={isFetchingMatches}>Reload Data</Button>
					<hr/>
					<h3>Players</h3>
					<hr/>
					<PoolPlayers matches={poolMatches}/>
					<h3>Matches</h3>
					<hr/>
					{
						poolMatches.map(val => {
							return (
								<MatchCard key={val.row} match={val}/>
							)
						})
					}
				</div>
			}
		</div>
	)
}
