import { ROSTER_SHEET } from "./constants.js";
import getSheetByName from "./getSheetByName.js";
import rawToRoster from "./rawToRoster.js";
export default function getRosterRows(tournament) {
    const sheet = getSheetByName(`${ROSTER_SHEET}_${tournament}`);
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(`A2:G${lastRow}`).getValues();
    return rawToRoster(range);
}
