import useTournamentData from "#hooks/useTournamentData";
import ok from "#lib/ok";


export default function PlayerChip({ id, wins, delta }: { id: string, wins?: number, delta?: string }) {
	const tournamentData = useTournamentData();
	const player = tournamentData.playerIndex.get(id);
	ok(player);

	return (
		<span className="playerChip">
			{
				wins !== undefined &&
				<span className="wins">[{wins}]</span>
			}
			<span className="title">{player.name}</span>
			<span className="ratingChip">({player.rating}{delta !== undefined ? <span className="delta">{delta}</span> : ""})</span>
		</span>
	)
}
