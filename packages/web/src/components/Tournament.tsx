import useTournamentData from "#hooks/useTournamentData";
import Loading from "./Loading";
import Pools from "./Pools";
import Roster from "./Roster";
import BackButton from "./BackButton";
import useAuth from "#hooks/useAuth";
import Button from "./Button";
import { useState } from "react";
import callGas from "#lib/callGas";
import ok from "#lib/ok";

export default function Tournament() {
	const { token } = useAuth();
	ok(token);
	const [isCreatingMatches, setIsCreatingMatches] = useState<boolean>(false);
	const [isUpdatingRatings, setIsUpdatingRatings] = useState<boolean>(false);
	const auth = useAuth();
	const data = useTournamentData();

	const createMatches = async () => {
		const confirmed = confirm("Create matches? This cannot be undone.");
		if (!confirmed) { return; }

		setIsCreatingMatches(true);
		await callGas(token, "createMatchesFromRoster", {
			tournament: data.tournament
		});
		await data.reloadMatches();
		setIsCreatingMatches(false);
	}

	const updateRatings = async () => {
		const confirmed = confirm("Update ratings? This cannot be undone.");
		if (!confirmed) { return; }

		setIsUpdatingRatings(true);
		await callGas(token, "calculateRatings", {
			tournament: data.tournament
		});
		await data.reloadRoster();
		setIsUpdatingRatings(false);
	}

	const isCompleted = data.isLoaded && data.matches.every(val => val.completed);

	return (
		<div className="tournament">
			<BackButton to="/"/>
			<Loading loading={!data.isLoaded}/>
			{
				data.isLoaded && data.pools.length > 0 && <Pools pools={data.pools}/>
			}
			{
				data.isLoaded && data.roster.length > 0 && <Roster players={data.roster}/>
			}
			{
				auth.type === "admin" &&
				<>
					<h3>Admin</h3>
					<hr/>
					<div>
						<Button onClick={createMatches} busy={isCreatingMatches}>Create Matches</Button>
					</div>
					{
						isCompleted &&
						<div>
							<Button onClick={updateRatings} busy={isUpdatingRatings}>Update Ratings</Button>
						</div>
					}
				</>
			}
		</div>
	)
}
