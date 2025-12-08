import getRosterRowsCf from "../getRosterRowsCf.js";
import type SheetsApi from "../SheetsApi.js";

export default async function getRosterCf(api: SheetsApi, data) {
	if (data.tournament === undefined) {
		throw new Error("Must specify tournament");
	}

	return getRosterRowsCf(api, data.tournament);
}
