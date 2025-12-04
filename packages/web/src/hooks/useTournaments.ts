import { useQuery } from "@tanstack/react-query";
import callGas from "#lib/callGas";

export default function useTournaments() {
	return useQuery<string[]>({
		queryKey: ["tournaments"],
		queryFn: async () => {
			return callGas("getTournaments", {});
		}
	});
}
