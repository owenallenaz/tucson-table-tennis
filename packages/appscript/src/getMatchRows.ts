import getSheetByName from "./getSheetByName.js";
import rawToMatches from "./rawToMatches.js";
import { MATCH_SHEET } from "./constants.js";
import type { MatchRow } from "./types.js";

export default function getMatchRows(tournament: string): MatchRow[] {
	const sheet = getSheetByName(`${MATCH_SHEET}_${tournament}`);
	const lastRow = sheet.getLastRow();
	if (lastRow === 1) {
		return [];
	}

	const values = sheet.getRange(`A2:G${lastRow}`).getValues();
	const matchRows = rawToMatches(values);

	return matchRows;
}
