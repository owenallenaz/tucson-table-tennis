import { TOKEN } from "./constants.js";
import hmacSha256Base64 from "./hmacSha256Base64.js";
import methodTest from "./methods/test.js";
import getRoster from "./methods/getRoster.js";
import createMatchesFromRoster from "./methods/createMatchesFromRoster.js";
import type { MethodHandler } from "./types.js";
import setPool from "./methods/setPool.js";

const methods = {
	test: methodTest,
	createMatchesFromRoster,
	getRoster,
	setPool
} satisfies Record<string, MethodHandler>

function doPost(e: GoogleAppsScript.Events.DoPost) {
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

	const expectedSig = hmacSha256Base64(TOKEN, JSON.stringify(packet));
	if (expectedSig !== data.signature) {
		throw new Error(`Invalid authentication, user not authorized.`);
	}

	const result = method(e, data.data);

	return ContentService.createTextOutput(JSON.stringify(result));
}

function test() {
	// const data = {
	// 	method: "createMatchesFromRoster",
	// 	data: {}
	// }
	const data = {
		method: "setPool",
		data: {
			pool: "C",
			id: "1"
		}
	}

	const signature = hmacSha256Base64(TOKEN, JSON.stringify(data));

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
