import { useQuery } from "@tanstack/react-query";
import callGas from "#lib/callGas";
import type { RosterRow } from "@tttc/appscript/types";

export default function useRoster(tournament: string) {
	return useQuery<RosterRow[]>({
		queryKey: ["roster", tournament],
		queryFn: async () => {
			return callGas("getRoster", { tournament });
		}
	});
}
