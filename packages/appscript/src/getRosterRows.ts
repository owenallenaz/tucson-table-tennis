import { ROSTER_SHEET } from "./constants.js";
import getSheetByName from "./getSheetByName.js";
import rawToRoster from "./rawToRoster.js";
import type { RosterRow } from "./types.js";

export default function getRosterRows(tournament: string): RosterRow[] {
	const sheet = getSheetByName(`${ROSTER_SHEET}_${tournament}`);
	const lastRow = sheet.getLastRow();
	const range = sheet.getRange(`A2:G${lastRow}`).getValues();

	return rawToRoster(range);
}
