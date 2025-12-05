import { createContext, useContext, useMemo, type ReactNode } from "react";
import useMatches from "#hooks/useMatches";
import useRoster from "#hooks/useRoster";
import type { MatchRow, RosterRow } from "@tttc/appscript/types";
import { EMPTY_MUTABLE_ARRAY } from "../constants";
import { useParams } from "react-router";
import ok from "#lib/ok";

interface TournamentContextData {
	tournament: string
	matches: MatchRow[]
	roster: RosterRow[]
	pools: string[]
	playerIndex: PlayerIndex
	isLoaded: boolean
	isFetching: boolean
}

type PlayerIndex = Map<string, RosterRow>

export const TournamentContext = createContext<TournamentContextData | null>(null);

export function TournamentDataProvider({ children }: { children: ReactNode }) {
	const { tournament } = useParams();
	ok(tournament);

	const matches = useMatches(tournament);
	const matchData = matches.data ?? EMPTY_MUTABLE_ARRAY;
	const roster = useRoster(tournament);
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
			tournament,
			matches: matchData,
			roster: rosterData,
			pools,
			isLoaded,
			isFetching,
			playerIndex
		}
	}, [
		tournament,
		matchData,
		rosterData,
		isLoaded,
		isFetching,
		pools,
		playerIndex
	]);

	return (
		<TournamentContext value={contextData}>
			{children}
		</TournamentContext>
	)
}

export default function useTournamentData() {
	const contextData = useContext(TournamentContext);
	ok(contextData);

	return contextData;
}
