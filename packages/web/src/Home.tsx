import Pools from "./Pools";
import Roster from "./Roster";
import useAppData from "./useAppData";

export default function Home() {
	const appData = useAppData();

	return (
		<div className="home">
			<h1>Tucson Table Tennis Club</h1>
			{
				appData.pools.length > 0 && <Pools pools={appData.pools}/>
			}
			{
				appData.roster.length > 0 && <Roster players={appData.roster}/>
			}
		</div>
	)
}
