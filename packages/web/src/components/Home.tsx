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
			<div className="help">
				<details>
					<summary role="button" className="outline secondary">Help</summary>
					<p>Choose a tournament. Within each tournament you will the list of players competing and the pools of the tournament.</p>
					<p>Click on a pool to see all matches within that pool. Click on a player to see all matches for that player.</p>
					<p>Ratings Help: Ratings are determined upon completion of the tournament. The formula used is published by <a href="https://usatt.simplycompete.com/info/ratings">usatt</a>.</p>
					<ul>
						<li>Every match, points are exchanged based on the difference in ratings.</li>
						<li>On individual matches we display a tentative rating change, the final rating is <b>not</b> the sum of all tentative rating changes.</li>
						<li>The final rating calculation takes into account all matches by all players. If one player is to gain a significant amount of ratings, the formula mandates that player is adjusted up, and then the whole tournament is re-calculated. This ensures that other players are not penalized by a low rated player overperforming and ensures that player is appropriately rated after the conclusion.</li>
					</ul>
				</details>
			</div>
		</div>
	)
}
