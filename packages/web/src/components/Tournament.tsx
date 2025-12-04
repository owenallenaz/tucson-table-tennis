import useTournamentData from "#hooks/useTournamentData";
import Loading from "./Loading";
import Pools from "./Pools";
import Roster from "./Roster";
import BackButton from "./BackButton";

export default function Tournament() {
	const data = useTournamentData();
	console.log("data", data.isLoaded, data.isFetching, data.pools, data.roster);

	return (
		<div className="tournament">
			<BackButton to="/"/>
			<Loading loading={!data.isLoaded}/>
			{
				data.isLoaded && data.pools.length > 0 && <Pools pools={data.pools}/>
			}
			{
				data.isLoaded && data.roster.length > 0 && <Roster players={data.roster}/>
			}
		</div>
	)
}
