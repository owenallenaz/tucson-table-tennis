import getMatchRows from "../getMatchRows.js";

export default function getMatches(e, data) {
	if (data.tournament === undefined) {
		throw new Error("Must specify tournament");
	}

	return getMatchRows(data.tournament);
}
