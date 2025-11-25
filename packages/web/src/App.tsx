import Groups from "./Groups";
import Roster from "./Roster";
import useMatches from "./useMatches";
import useRoster from "./useRoster";

export default function App() {
	const players = useRoster();
	const matches = useMatches();
	console.log("matches", matches.data);

	return (
		<main className="container">
			<h1>Tucson Table Tennis Club</h1>
			{
				matches.isLoading && <p>Loading...</p>
			}
			{
				!matches.isLoading && <Groups matches={matches.data}/>
			}
			{
				!players.isLoading && <Roster players={players.data}/>
			}
		</main>
	)
}
