import { useQuery } from "@tanstack/react-query";
import callGas from "./callGas";

export default function useRoster() {
	return useQuery({
		queryKey: ["roster"],
		queryFn: async () => {
			return callGas("getRoster", {});
		}
	});
}
