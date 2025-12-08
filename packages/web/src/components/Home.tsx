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
					<p>Click <b>Edit</b> on any match to input the game score.</p>
					<h3>Ratings</h3>
					<p>The formula for calculating ratings is published by <a href="https://usatt.simplycompete.com/info/ratings">USA Table Tennis</a>.</p>
					<ul>
						<li>Every match, the winner gains and the loser loses an equal number of ratings points.</li>
						<li>The number of points a match is worth depends on the distance between the players ratings, the closer together the rating, the less points are exchanged.</li>
						<li>An upset is worth more than an expected victory.</li>
						<li>On individual matches we display a tentative rating change, the final rating is <b>not</b> the sum of all tentative rating changes.</li>
						<li>The final rating calculation takes into account all matches by all players. If one player is to gain a significant amount of ratings, the formula mandates that player is adjusted up, and then the whole tournament is re-calculated. This ensures that other players are not penalized by a low rated player overperforming and ensures that player is appropriately rated after the conclusion.</li>
					</ul>
					<h3>Pool Ranking</h3>
					<p>Pool play rank is determined by the following formula.</p>
					<ul>
						<li>Match wins</li>
						<li>In the event of a two-way tie, head to head winner breaks the tie.</li>
						<li>In the event of a three-way tie, the <b>games</b> played between the only the tied three players are compared. In the event of a two-way tie in games, head to head will break it. In the unlikely event of a three-way tie, a tie-break game will be played.</li>
					</ul>
				</details>
			</div>
		</div>
	)
}
