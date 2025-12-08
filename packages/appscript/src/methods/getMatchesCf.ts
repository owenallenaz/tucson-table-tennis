import type SheetsApi from "../SheetsApi.js";
import getMatchRowsCf from "../getMatchRowsCf.js";

export default async function getMatchesCf(api: SheetsApi, data) {
	if (data.tournament === undefined) {
		throw new Error("Must specify tournament");
	}

	return getMatchRowsCf(api, data.tournament);
}
