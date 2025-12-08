import { useQuery } from "@tanstack/react-query";
import type { MatchRow } from "@tttc/appscript/types";
import callCf from "#lib/callCf";
import useAuth from "./useAuth";
import ok from "#lib/ok";

export default function useMatches(tournament: string) {
	const { token } = useAuth();
	ok(token);

	return useQuery<MatchRow[]>({
		queryKey: ["matches", tournament],
		refetchOnWindowFocus: true,
		queryFn: async () => {
			return callCf(token, "getMatches", { tournament });
		}
	});
}
