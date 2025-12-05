import type { MatchRow } from "@tttc/appscript/types";
import PlayerChip from "./PlayerChip";
import useMatchPlayers from "#hooks/useMatchPlayers";
import { useState } from "react";
import Button from "./Button";
import MatchForm from "./MatchForm";

export default function MatchCard({ match }: { match: MatchRow }) {
	const [showDialog, setShowDialog] = useState(false);
	const players = useMatchPlayers(match);

	const onClose = function() {
		setShowDialog(false);
	}

	const onEdit = function() {
		setShowDialog(true);
	}

	return (
		<article>
			<div>
				<PlayerChip id={players.first.id} wins={players.firstWins} delta={players.firstDelta} winner={players.first.id === match.winner}/>
				<span className="vs">vs</span>
				<PlayerChip id={players.second.id} wins={players.secondWins} delta={players.secondDelta} winner={players.second.id === match.winner}/>
			</div>
			<div>
				<Button onClick={onEdit}>Edit</Button>
			</div>
			<dialog open={showDialog}>
				<article>
					<div className="dialogHeader">
						<Button onClick={onClose} className="outline contrast">Close</Button>
					</div>
					<div>
						<MatchForm
							match={match}
							onClose={onClose}
						/>
					</div>
				</article>
			</dialog>
		</article>
	)
}
