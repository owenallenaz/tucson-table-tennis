import type { RosterRow } from "@tttc/appscript/types";
import { NavLink } from "react-router";

export default function Roster({ players }: { players: RosterRow[] }) {
	return (
		<section>
			<h3>Players</h3>
			<hr/>
			<ul>
				{
					players.map(val => {
						return <li><NavLink to={`/players/${val.id}`}>{val.name}</NavLink> - {val.rating} - {val.pool}</li>
					})
				}
			</ul>
		</section>
	)
}
