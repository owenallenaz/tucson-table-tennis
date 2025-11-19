import rawToRoster from "../rawToRoster.js";
import getSheetByName from "../getSheetByName.js";

export default function getRoster() {
	const sheet = getSheetByName("Roster");
	const lastRow = sheet.getLastRow();
	const range = sheet.getRange(`A2:D${lastRow}`).getValues();
	const filtered = range.filter((val) => {
		return val[0] !== "";
	});

	return rawToRoster(filtered);
}
