import rawToMatches from "../rawToMatches.js";
import getSheetByName from "../getSheetByName.js";
import getRoster from "./getRoster.js";
import { processTournament } from "usatt-ratings";

export default function calculateRatings() {
	const roster = getRoster();
	const sheet = getSheetByName("Matches");
	const lastRow = sheet.getLastRow();

	const values = sheet.getRange(`A2:E${lastRow}`).getValues();
	const matchRows = rawToMatches(values);

	const matches = matchRows.map(val => {
		const winner = val.aWins > val.bWins ? val.idA : val.idB;
		const loser = val.idA === winner ? val.idB : val.idA;
		return {
			winner,
			loser
		}
	});

	const result = processTournament(matches, roster);
	const rosterSheet = getSheetByName("Roster");
	const rosterLastRow = rosterSheet.getLastRow();
	const ids = rosterSheet.getRange(`A2:A${rosterLastRow}`).getValues().flat().map(val => val.toString());
	for (const row of result) {
		const idIndex = ids.indexOf(row.id);
		if (idIndex === -1) {
			continue;
		}

		const rowNumber = idIndex + 2;
		rosterSheet.getRange(`E${rowNumber}`).setValue(row.rating);
		rosterSheet.getRange(`F${rowNumber}`).setValue(row.delta);
	}
}
