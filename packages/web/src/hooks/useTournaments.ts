import { useQuery } from "@tanstack/react-query";
import callCf from "#lib/callCf";
import useAuth from "./useAuth";
import ok from "#lib/ok";

export default function useTournaments() {
	const { token } = useAuth();
	ok(token);

	return useQuery<string[]>({
		queryKey: ["tournaments"],
		queryFn: async () => {
			return callCf(token, "getTournaments", {});
		}
	});
}
