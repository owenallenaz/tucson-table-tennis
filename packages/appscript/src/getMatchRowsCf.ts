import rawToMatches from "./rawToMatches.js";
import { MATCH_SHEET } from "./constants.js";
import type { MatchRow } from "./types.js";
import type SheetsApi from "./SheetsApi.js";

export default async function getMatchRowsCf(api: SheetsApi, tournament: string): Promise<MatchRow[]> {
	const raw = await api.readRange(`${MATCH_SHEET}_${tournament}!A2:G`);
	const matchRows = rawToMatches(raw);

	return matchRows;
}
