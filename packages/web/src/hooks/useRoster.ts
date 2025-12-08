import { useQuery } from "@tanstack/react-query";
import type { RosterRow } from "@tttc/appscript/types";
import callCf from "#lib/callCf";
import useAuth from "./useAuth";
import ok from "#lib/ok";

export default function useRoster(tournament: string) {
	const { token } = useAuth();
	ok(token);

	return useQuery<RosterRow[]>({
		queryKey: ["roster", tournament],
		queryFn: async () => {
			return callCf(token, "getRoster", { tournament });
		}
	});
}
