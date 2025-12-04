import { Route, Routes } from "react-router";
import Home from "./Home";
import Pool from "./Pool";
import Player from "./Player";
import useAuth from "#hooks/useAuth";
import Login from "./Login";
import TournamentLayout from "./TournamentLayout";
import Tournament from "./Tournament";

export default function App() {
	const auth = useAuth();

	return (
		<>
			<header className="header">Tucson Table Tennis Club <button className="logout" onClick={auth.logout}>Logout</button></header>
			<main className="container">
				{
					auth?.token === undefined &&
					<Login/>
				}
				{
					auth?.token !== undefined &&
					<Routes>
						<Route index element={<Home/>}/>
						<Route path="/tournament/:tournament" element={<TournamentLayout/>}>
							<Route index element={<Tournament/>}/>
							<Route path="pools/:pool" element={<Pool/>}/>
							<Route path="players/:player" element={<Player/>}/>
						</Route>
					</Routes>
				}
			</main>
		</>
	)
}
