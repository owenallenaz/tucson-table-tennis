import { createContext, useContext, useMemo, type ReactNode } from "react";
import useMatches from "./useMatches";
import useRoster from "./useRoster";
import type { MatchRow, RosterRow } from "@tttc/appscript/types";
import { EMPTY_MUTABLE_ARRAY } from "./constants";

interface AppContextData {
	matches: MatchRow[]
	roster: RosterRow[]
	pools: string[]
	playerIndex: PlayerIndex
	isLoaded: boolean
	isFetching: boolean
}

type PlayerIndex = Map<string, RosterRow>

export const AppContext = createContext<AppContextData>({
	matches: [],
	roster: [],
	pools: [],
	isLoaded: false,
	isFetching: false,
	playerIndex: new Map()
});

export function AppDataProvider({ children }: { children: ReactNode }) {
	const matches = useMatches();
	const matchData = matches.data ?? EMPTY_MUTABLE_ARRAY;
	const roster = useRoster();
	const rosterData = roster.data ?? EMPTY_MUTABLE_ARRAY;
	const isLoaded = matches.isFetched && roster.isFetched;
	const isFetching = matches.isFetching && roster.isFetching;

	const playerIndex = useMemo(() => {
		const map = new Map<string, RosterRow>();

		for (const player of rosterData) {
			map.set(player.id, player)
		}

		return map;
	}, [rosterData]);

	const pools = useMemo(() => {
		const set = new Set<string>();
		for (const row of matchData) {
			set.add(row.pool);
		}

		return [...set];
	}, [matchData]);

	const contextData = useMemo(() => {
		return {
			matches: matchData,
			roster: rosterData,
			pools,
			isLoaded,
			isFetching,
			playerIndex
		}
	}, [
		matchData,
		rosterData,
		isLoaded,
		isFetching,
		pools,
		playerIndex
	]);

	return (
		<AppContext value={contextData}>
			{children}
		</AppContext>
	)
}

export default function useAppData() {
	const contextData = useContext(AppContext);
	return contextData;
}
