import hmacSha256Base64 from "./hmacSha256Base64.js";
import methodTest from "./methods/test.js";
import getRoster from "./methods/getRoster.js";
import createMatchesFromRoster from "./methods/createMatchesFromRoster.js";
import type { MethodHandler } from "./types.js";
import setPool from "./methods/setPool.js";
import calculateRatings from "./methods/calculateRatings.js";
import addMatch from "./methods/addMatch.js";
import getMatches from "./methods/getMatches.js";
import getToken from "./getToken.js";
import getTournaments from "./methods/getTournaments.js";
import checkToken from "./methods/checkToken.js";
import updateMatch from "./methods/updateMatch.js";

const methods = {
	addMatch,
	test: methodTest,
	calculateRatings,
	checkToken,
	createMatchesFromRoster,
	getRoster,
	getMatches,
	getTournaments,
	setPool,
	updateMatch
} satisfies Record<string, MethodHandler>

function doGet() {
	return ContentService.createTextOutput("Must specify POST request.");
}

function errorWrap(method) {
	return (e: GoogleAppsScript.Events.DoPost) => {
		try {
			return method(e)
		} catch (e: any) {
			return ContentService.createTextOutput(e.toString());
		}
	}
}

const doPost = errorWrap(_doPost);

function _doPost(e: GoogleAppsScript.Events.DoPost) {
	const data = JSON.parse(e.postData.contents);
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

	const token = getToken();

	if (data.method !== "checkToken") {
		const expectedSig = hmacSha256Base64(token, JSON.stringify(packet));
		if (expectedSig !== data.signature) {
			throw new Error(`Invalid authentication, user not authorized.`);
		}
	}

	const result = method(e, data.data);

	const response = ContentService.createTextOutput(JSON.stringify(result));
	response.setMimeType(ContentService.MimeType.JSON);
	return response;
}

function test() {
	// const data = {
	// 	method: "createMatchesFromRoster",
	// 	data: {
	// 		tournament: "2025_11_15"
	// 	}
	// }
	// const data = {
	// 	method: "setPool",
	// 	data: {
	// 		pool: "C",
	// 		id: "1"
	// 	}
	// }
	// const data = {
	// 	method: "calculateRatings",
	// 	data: {
	// 		tournament: "2025_11_15"
	// 	}
	// }
	// const data = {
	// 	method: "addMatch",
	// 	data: {
	// 		idA: "1",
	// 		idB: "2",
	// 		aWins: 3,
	// 		bWins: 2
	// 	}
	// }
	// const data = {
	// 	method: "getMatches",
	// 	data: {
	// 		tournament: "2025_11_15"
	// 	}
	// }
	// const data = {
	// 	method: "getTournaments",
	// 	data: {
	// 		tournament: "2025_11_15"
	// 	}
	// }
	// const data = {
	// 	method: "getRoster",
	// 	data: {
	// 		tournament: "2025_11_15"
	// 	}
	// }
	// const data = {
	// 	method: "checkToken",
	// 	data: {
	// 		token: "tttc"
	// 	}
	// }
	const data = {
		method: "updateMatch",
		data: {
			tournament: "2025_11_15",
			row: 8,
			aWins: 3,
			bWins: 0
		}
	}

	const token = getToken();
	const signature = hmacSha256Base64(token, JSON.stringify(data));

	const result = doPost({
		postData: {
			contents: JSON.stringify({
				...data,
				signature
			})
		}
	} as any);
	console.log("result", result.getContent());
}
