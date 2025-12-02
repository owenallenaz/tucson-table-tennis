import getSheetByName from "../getSheetByName.js";
import rawToMatches from "../rawToMatches.js";
export default function getMatches() {
    const sheet = getSheetByName("Matches");
    const lastRow = sheet.getLastRow();
    const values = sheet.getRange(`A2:E${lastRow}`).getValues();
    const matchRows = rawToMatches(values);
    return matchRows;
}
