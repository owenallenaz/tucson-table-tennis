import { ADMIN_SHEET, TOURNAMENTS_COLUMN } from "../constants.js";
import getSheetByName from "../getSheetByName.js";
export default function getTournaments() {
    const sheet = getSheetByName(ADMIN_SHEET);
    const data = sheet.getRange(`${TOURNAMENTS_COLUMN}2:${TOURNAMENTS_COLUMN}100`).getValues();
    return data.flat().filter(val => val !== "");
}
