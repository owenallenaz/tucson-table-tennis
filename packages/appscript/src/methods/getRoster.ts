import getRosterRows from "../getRosterRows.js";

export default function getRoster(e, data) {
	if (data.tournament === undefined) {
		throw new Error("Must specify tournament");
	}

	return getRosterRows(data.tournament);
}
