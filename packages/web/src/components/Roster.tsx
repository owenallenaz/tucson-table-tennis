import useTournamentData from "#hooks/useTournamentData";
import type { RosterRow } from "@tttc/appscript/types";
import { NavLink } from "react-router";

export default function Roster({ players }: { players: RosterRow[] }) {
	const data = useTournamentData();
	const isComplete = data.matches.every(val => val.completed);

	return (
		<section>
			<h3>Players</h3>
			<hr/>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Rating</th>
						{
							isComplete &&
							<>
								<th>New Rating</th>
								<th>Delta</th>
							</>
						}
						<th>Pool</th>
					</tr>
				</thead>
				<tbody>
					{
						players.map(val => {
							return (
								<tr key={val.id}>
									<td><NavLink to={`players/${val.id}`}>{val.name}</NavLink></td>
									<td>{val.rating}</td>
									{
										isComplete &&
										<>
											<td>{val.newRating}</td>
											<td>{val.delta}</td>
										</>
									}
									<td>{val.pool}</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</section>
	)
}
