import { Route, Routes } from "react-router";
import Home from "./Home";
import Pool from "./Pool";
import useAppData from "./useAppData";
import Player from "./Player";
import useAuth from "./useAuth";
import Login from "./Login";
import RouteTree from "./RouteTree";

export default function App() {
	const auth = useAuth();
	// const appData = useAppData();

	// console.log("appData", appData);
	const logout = () => {
		auth.logout();
	}


	return (
		<>
			<header className="header">Tucson Table Tennis Club <button className="logout" onClick={logout}>Logout</button></header>
			<main className="container">
				{
					auth?.token === undefined &&
					<Login/>
				}
				{
					auth?.token !== undefined &&
					<RouteTree/>
				}
				{/* {
					appData.isLoaded && (
						<Routes>
							<Route index element={<Home/>}/>
							<Route path="/pools/:pool" element={<Pool/>}/>
							<Route path="/players/:player" element={<Player/>}/>
						</Routes>
					)
				} */}
			</main>
		</>
	)
}
