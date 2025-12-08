import { ROSTER_SHEET } from "./constants.js";
import rawToRoster from "./rawToRoster.js";
import type SheetsApi from "./SheetsApi.js";
import type { RosterRow } from "./types.js";

export default async function getRosterRowsCf(api: SheetsApi, tournament: string): Promise<RosterRow[]> {
	const raw = await api.readRange(`${ROSTER_SHEET}_${tournament}!A2:G`);
	return rawToRoster(raw);
}
