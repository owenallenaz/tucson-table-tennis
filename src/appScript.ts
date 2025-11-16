// function methodTest(e, data) {
// 	const ss = SpreadsheetApp.getActiveSpreadsheet();
// 	const sheet = ss.getSheetByName("matches");
// 	if (!sheet) {
// 		throw new Error("Sheet not found.");
// 	}

// 	const range = sheet.getRange("A1:A3");
// 	range.setValues([["a", "b", "c"]]);

// 	return "complete";
// }
import methodTest from "./methods/test.js";
import type { MethodHandler } from "./types.js";

const methods = {
	test: methodTest
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

	const result = method(e, data.data);

	return ContentService.createTextOutput(JSON.stringify(result));
}

function test() {
	const result = doPost({
		postData: {
			contents: JSON.stringify({
				method: "test",
				data: {
					something: "foo"
				}
			})
		}
	} as any);
	console.log("result", result.getContent());
}
