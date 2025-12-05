import useTournaments from "#hooks/useTournaments";
import { NavLink } from "react-router";
import Loading from "./Loading";

export default function Home() {
	const tournamentQuery = useTournaments();

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
								return <li key={val}><NavLink to={`/tournament/${val}`}>{val}</NavLink></li>
							})
						}
					</ul>
				}
			</div>
		</div>
	)
}
