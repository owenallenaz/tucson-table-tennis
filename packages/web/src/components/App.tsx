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
	console.log("auth", auth);

	return (
		<>
			<header className="header">
				<span>Tucson Table Tennis Club</span>
				{
					auth?.token !== undefined &&
					<span>
						<span className="userType">({auth.type})</span>
						<button className="logout" onClick={auth.logout}>Logout</button>
					</span>
				}
			</header>
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
