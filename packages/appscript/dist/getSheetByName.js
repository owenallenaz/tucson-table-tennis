export default function getSheetByName(name) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(name);
    if (!sheet) {
        throw new Error("Sheet not found.");
    }
    return sheet;
}
