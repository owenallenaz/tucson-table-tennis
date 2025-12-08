import type SheetsApi from "../SheetsApi.js";
import { MATCH_A_WINS_CELL, MATCH_B_WINS_CELL, MATCH_SHEET } from "../constants.js";

interface UpdateMatchArgs {
	tournament: string
	row: number
	aWins: number
	bWins: number
}

export default async function updateMatchCf(api: SheetsApi, data: UpdateMatchArgs) {
	if (data.tournament === undefined) {
		throw new Error("Must specify tournament");
	}

	await api.updateRange(`${MATCH_SHEET}_${data.tournament}!${MATCH_A_WINS_CELL}${data.row}`, [
		[data.aWins.toString()]
	]);

	await api.updateRange(`${MATCH_SHEET}_${data.tournament}!${MATCH_B_WINS_CELL}${data.row}`, [
		[data.bWins.toString()]
	]);

	return {
		success: true
	}
}
