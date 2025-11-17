export default function getSheetByName(name: string): GoogleAppsScript.Spreadsheet.Sheet {
	const ss = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = ss.getSheetByName(name);
	if (!sheet) {
		throw new Error("Sheet not found.");
	}

	return sheet;
}
