import RatingChip from "./RatingChip";
import useAppData from "./useAppData";


export default function PlayerChip({ id, delta }: { id: string, delta?: string }) {
	const appData = useAppData();
	const player = appData.playerIndex.get(id);
	if (!player) { throw new Error("Player not found."); }

	return (
		<span className="playerChip">
			<span className="title">{player.name}</span>
			<RatingChip rating={player.rating} delta={delta}/>
		</span>
	)
}
