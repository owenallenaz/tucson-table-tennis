import useTournamentData from "#hooks/useTournamentData";
import Loading from "./Loading";
import Pools from "./Pools";
import Roster from "./Roster";
import BackButton from "./BackButton";
import useAuth from "#hooks/useAuth";
import Button from "./Button";
import { useState } from "react";
import callGas from "#lib/callGas";

export default function Tournament() {
	const [isCreatingMatches, setIsCreatingMatches] = useState<boolean>(false);
	const auth = useAuth();
	const data = useTournamentData();

	const createMatches = async () => {
		setIsCreatingMatches(true);
		await callGas("createMatchesFromRoster", {
			tournament: data.tournament
		});
		setIsCreatingMatches(false);
	}

	console.log("data", data);

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
					<Button onClick={createMatches} busy={isCreatingMatches}>Create Matches</Button>
				</>
			}
		</div>
	)
}
