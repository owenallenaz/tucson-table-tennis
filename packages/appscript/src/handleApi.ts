import getTokenMemo from "./getTokenMemo.js";
import getTokensCf from "./getTokensCf.js";
import hmacSha256Base64Web from "./hmacSha256Base64Web.js";
import getMatchesCf from "./methods/getMatchesCf.js";
import getRosterCf from "./methods/getRosterCf.js";
import getTournamentsCf from "./methods/getTournamentsCf.js";
import updateMatchCf from "./methods/updateMatchCf.js";
import SheetsApi from "./SheetsApi.js";

const methods = {
	getMatches: getMatchesCf,
	getRoster: getRosterCf,
	getTournaments: getTournamentsCf,
	updateMatch: updateMatchCf
}

export default async function handleApi(request, env, ctx) {
	if (request.method !== "POST") {
		return { success: false, message: "Method not allowed." }
	}

	const {
		GOOGLE_CLIENT_EMAIL,
		GOOGLE_PRIVATE_KEY,
		SHEET_ID
	} = env;

	const googleToken = await getTokenMemo(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);

	const sheetsApi = new SheetsApi({ token: googleToken, sheet: SHEET_ID });

	const data = await request.json();
	if (!data.method) {
		throw new Error("Must pass JSON data and declare a method");
	}

	const method = methods[data.method];
	if (!method) {
		throw new Error(`Invalid method '${data.method}', must be one of ${Object.keys(methods).join(", ")}.`)
	}

	const packet = {
		method: data.method,
		data: data.data
	}

	const { token, adminToken } = await getTokensCf(sheetsApi);
	if (data.method !== "checkToken") {
		const jsonString = JSON.stringify(packet);
		const primarySig = await hmacSha256Base64Web(token, jsonString);
		const adminSig = await hmacSha256Base64Web(adminToken, jsonString);
		if (primarySig !== data.signature && adminSig !== data.signature) {
			throw new Error(`Invalid authentication, user not authorized.`);
		}
	}

	const result = method(sheetsApi, data.data);
	return result;
}
