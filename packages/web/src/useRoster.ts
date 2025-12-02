import { useQuery } from "@tanstack/react-query";
import callGas from "./callGas";
import type { RosterRow } from "@tttc/appscript/types";

export default function useRoster() {
	return useQuery<RosterRow[]>({
		queryKey: ["roster"],
		queryFn: async () => {
			return callGas("getRoster", {});
		}
	});
}
