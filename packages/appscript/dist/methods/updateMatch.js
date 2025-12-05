import { MATCH_A_WINS_CELL, MATCH_B_WINS_CELL, MATCH_SHEET } from "../constants.js";
import getSheetByName from "../getSheetByName.js";
export default function updateMatch(e, data) {
    if (data.tournament === undefined) {
        throw new Error("Must specify tournament");
    }
    const sheet = getSheetByName(`${MATCH_SHEET}_${data.tournament}`);
    sheet.getRange(`${MATCH_A_WINS_CELL}${data.row}`).setValue(data.aWins);
    sheet.getRange(`${MATCH_B_WINS_CELL}${data.row}`).setValue(data.bWins);
    return {
        success: true
    };
}
