import getSheetByName from "../getSheetByName.js";
import calculateMatches from "../calculateMatches.js";
import getRosterRows from "../getRosterRows.js";
import { ADMIN_SHEET, MATCH_SHEET } from "../constants.js";

export default function createMatchesFromRoster(e, data) {
	if (data.tournament === undefined) {
		throw new Error("Must specify tournament");
	}

	const roster = getRosterRows(data.tournament);
	const sheet = getSheetByName(`${MATCH_SHEET}_${data.tournament}`);

	const pools: Record<string, string[]> = {};
	for (const player of roster) {
		if (!player.pool) {
			continue;
		}

		if (!player.id) {
			continue;
		}

		if (pools[player.pool] === undefined) {
			pools[player.pool] = [];
		};

		pools[player.pool].push(player.id);
	}

	const rawData: string[][] = [];
	for (const [pool, ids] of Object.entries(pools)) {
		const matches = calculateMatches(ids);
		matches.forEach((val) => {
			rawData.push([
				pool,
				val[0],
				`=XLOOKUP(INDEX(B:B, ROW()), ${ADMIN_SHEET}!A:A, ${ADMIN_SHEET}!B:B)`,
				val[1],
				`=XLOOKUP(INDEX(D:D, ROW()), ${ADMIN_SHEET}!A:A, ${ADMIN_SHEET}!B:B)`,
			]);
		});
	}

	const lastRow = sheet.getLastRow();
	sheet.getRange(`A${lastRow + 1}:E${lastRow + rawData.length}`).setValues(rawData);

	return rawData;
}
