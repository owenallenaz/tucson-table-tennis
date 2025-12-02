import { useQuery } from "@tanstack/react-query";
import callGas from "./callGas";
import type { MatchRow } from "@tttc/appscript/types";

export default function useMatches() {
	return useQuery<MatchRow[]>({
		queryKey: ["matches"],
		queryFn: async () => {
			return callGas("getMatches", {});
		}
	});
}
