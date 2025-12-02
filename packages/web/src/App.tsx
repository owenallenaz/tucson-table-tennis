import { Route, Routes } from "react-router";
import Home from "./Home";
import Pool from "./Pool";
import useAppData from "./useAppData";
import Player from "./Player";

export default function App() {
	const appData = useAppData();

	console.log("appData", appData);

	return (
		<>
			<header>Tucson Table Tennis Club</header>
			<main className="container" aria-busy={!appData.isLoaded}>
				{
					appData.isLoaded && (
						<Routes>
							<Route index element={<Home/>}/>
							<Route path="/pools/:pool" element={<Pool/>}/>
							<Route path="/players/:player" element={<Player/>}/>
						</Routes>
					)
				}
			</main>
		</>
	)
}
