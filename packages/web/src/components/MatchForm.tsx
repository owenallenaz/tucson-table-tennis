import type { MatchRow } from "@tttc/appscript/types";
import { useState, type FormEvent } from "react";
import Button from "./Button";
import useMatchPlayers from "#hooks/useMatchPlayers";
import useTournamentData from "#hooks/useTournamentData";
import callCf from "#lib/callCf";
import useAuth from "#hooks/useAuth";
import ok from "#lib/ok";

export default function MatchForm({
	match,
	onClose
}: {
	match: MatchRow
	onClose: () => void
}) {
	const { token } = useAuth();
	ok(token);
	const { tournament, reloadMatches } = useTournamentData();
	const players = useMatchPlayers(match);
	const [firstWins, setFirstWins] = useState(players.firstWins ?? "");
	const [secondWins, setSecondWins] = useState(players.secondWins ?? "");
	const [processing, setProcessing] = useState(false);

	const onSubmit = async (e: FormEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (isInvalid) {
			return;
		}

		setProcessing(true);
		const firstWinsInt = firstWins !== "" ? Number(firstWins) : firstWins;
		const secondWinsInt = secondWins !== "" ? Number(secondWins) : secondWins;
		const aWins = players.first === players.playerA ? firstWinsInt : secondWinsInt;
		const bWins = players.first === players.playerA ? secondWinsInt : firstWinsInt;

		await callCf(token, "updateMatch", {
			tournament,
			row: match.row,
			aWins,
			bWins
		});

		await reloadMatches();

		setProcessing(false);
		onClose();
	}

	let isInvalid = false;
	if (firstWins !== "" && secondWins !== "") {
		const firstWinsInt = Number(firstWins);
		const secondWinsInt = Number(secondWins);

		if (firstWinsInt === secondWinsInt) {
			isInvalid = true;
		} else if (firstWinsInt >= 5 || secondWinsInt >= 5) {
			isInvalid = true;
		} else if (firstWinsInt < 0 || secondWinsInt < 0) {
			isInvalid = true;
		}
	}

	return (
		<form>
			<fieldset>
				<label>
					{players.first.name}
					<input
						name="firstWins"
						placeholder="Games Won"
						value={firstWins}
						type="number"
						onChange={(e) => setFirstWins(e.currentTarget.value)}
					/>
				</label>
				<label>
					{players.second.name}
					<input
						name="firstWins"
						placeholder="Games Won"
						value={secondWins}
						type="number"
						onChange={(e) => setSecondWins(e.currentTarget.value)}
					/>
				</label>
			</fieldset>
			{
				isInvalid &&
				<p className="matchValidationError">Invalid game scores, both inputs must be a number between 0 and 5 and not equal.</p>
			}
			<Button busy={processing} onClick={onSubmit} size="large">Save</Button>
		</form>
	)
}
