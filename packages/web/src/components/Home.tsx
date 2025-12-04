import Pools from "./Pools";
import Roster from "./Roster";
// import useAppData from "./useAppData";
import useTournaments from "#hooks/useTournaments";
import { NavLink } from "react-router";
import Loading from "./Loading";

export default function Home() {
	// const appData = useAppData();
	const tournamentQuery = useTournaments();
	console.log("tournamentQuery", tournamentQuery, tournamentQuery.data);

	return (
		<div className="home">
			<h3>Tournaments</h3>
			<Loading loading={tournamentQuery.isFetching}/>
			<div className="tournamentList">
				{
					tournamentQuery.data &&
					<ul>
						{
							tournamentQuery.data.map(val => {
								return <li><NavLink to={`/tournament/${val}`}>{val}</NavLink></li>
							})
						}
					</ul>
				}
			</div>
		</div>
	)
}
