import getSheetByName from "../getSheetByName.js";
import { processTournament } from "usatt-ratings";
import type { MatchRow, MatchRowCompleted } from "src/types.js";
import getMatchRows from "../getMatchRows.js";
import getRosterRows from "../getRosterRows.js";
import { ROSTER_DELTA_CELL, ROSTER_NEW_RATING_CELL, ROSTER_SHEET } from "../constants.js";

function isComplete(matchRow: MatchRow): matchRow is MatchRowCompleted {
	return matchRow.completed;
}

export default function calculateRatings(e, data) {
	if (data.tournament === undefined) {
		throw new Error("Must specify tournament");
	}

	const roster = getRosterRows(data.tournament);
	const matchRows = getMatchRows(data.tournament);
	const completedMatches: MatchRowCompleted[] = matchRows.filter(isComplete);
	if (matchRows.length !== completedMatches.length) {
		return {
			success: false,
			message: "All matches must be completed."
		}
	}

	const matches = completedMatches.map(val => {
		return {
			winner: val.winner,
			loser: val.loser
		}
	});

	const result = processTournament(matches, roster);
	const rosterSheet = getSheetByName(`${ROSTER_SHEET}_${data.tournament}`);
	for (const row of result) {
		const player = roster.find(val => val.id === row.id);
		if (!player) {
			continue;
		}

		const rowNumber = player.row;
		rosterSheet.getRange(`${ROSTER_NEW_RATING_CELL}${rowNumber}`).setValue(row.rating);
		rosterSheet.getRange(`${ROSTER_DELTA_CELL}${rowNumber}`).setValue(row.delta);
	}

	return {
		success: true
	}
}
