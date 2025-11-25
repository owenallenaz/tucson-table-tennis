export default function Roster({ players }) {
	return (
		<div>
			<h3>Players</h3>
			<ul>
				{
					players.map(val => {
						console.log("val", val);
						return <li>{val.name} - {val.rating} - {val.pool}</li>
					})
				}
			</ul>
		</div>
	)
}
