import { useQuery } from "@tanstack/react-query";
import callGas from "./callGas";

export default function useMatches() {
	return useQuery({
		queryKey: ["matches"],
		queryFn: async () => {
			return callGas("getMatches", {});
		}
	});
}
