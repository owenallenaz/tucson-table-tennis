import { Outlet } from "react-router";
import { TournamentDataProvider } from "#hooks/useTournamentData";

export default function TournamentLayout() {
	return (
		<TournamentDataProvider>
			<Outlet/>
		</TournamentDataProvider>
	)
}
