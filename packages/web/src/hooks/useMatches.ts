import { useQuery } from "@tanstack/react-query";
import callGas from "#lib/callGas";
import type { MatchRow } from "@tttc/appscript/types";

export default function useMatches(tournament: string) {
	return useQuery<MatchRow[]>({
		queryKey: ["matches", tournament],
		refetchOnWindowFocus: true,
		queryFn: async () => {
			return callGas("getMatches", { tournament });
		}
	});
}
