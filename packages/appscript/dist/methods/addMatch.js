import getSheetByName from "../getSheetByName.js";
export default function addMatch(e, data) {
    const fields = ["idA", "idB", "aWins", "bWins"];
    for (const field of fields) {
        if (data[field] === undefined) {
            throw new Error(`Must specify ${field}`);
        }
    }
    const sheet = getSheetByName("Matches");
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    sheet.getRange(`B${newRow}:E${newRow}`).setValues([
        [data.idA, data.idB, data.aWins, data.bWins]
    ]);
}
