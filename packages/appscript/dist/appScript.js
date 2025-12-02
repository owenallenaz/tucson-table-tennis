import { TOKEN } from "./constants.js";
import hmacSha256Base64 from "./hmacSha256Base64.js";
import methodTest from "./methods/test.js";
import getRoster from "./methods/getRoster.js";
import createMatchesFromRoster from "./methods/createMatchesFromRoster.js";
import setPool from "./methods/setPool.js";
import calculateRatings from "./methods/calculateRatings.js";
import addMatch from "./methods/addMatch.js";
import getMatches from "./methods/getMatches.js";
const methods = {
    addMatch,
    test: methodTest,
    calculateRatings,
    createMatchesFromRoster,
    getRoster,
    getMatches,
    setPool
};
function doGet() {
    return ContentService.createTextOutput("Must specify POST request.");
}
function errorWrap(method) {
    return (e) => {
        try {
            return method(e);
        }
        catch (e) {
            return ContentService.createTextOutput(e.toString());
        }
    };
}
const doPost = errorWrap(_doPost);
function _doPost(e) {
    const data = JSON.parse(e.postData.contents);
    if (!data.method) {
        throw new Error("Must pass JSON data and declare a method");
    }
    const method = methods[data.method];
    if (!method) {
        throw new Error(`Invalid method '${data.method}', must be one of ${Object.keys(methods).join(", ")}.`);
    }
    const packet = {
        method: data.method,
        data: data.data
    };
    const expectedSig = hmacSha256Base64(TOKEN, JSON.stringify(packet));
    if (expectedSig !== data.signature) {
        throw new Error(`Invalid authentication, user not authorized.`);
    }
    const result = method(e, data.data);
    const response = ContentService.createTextOutput(JSON.stringify(result));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
}
function test() {
    // const data = {
    // 	method: "createMatchesFromRoster",
    // 	data: {}
    // }
    // const data = {
    // 	method: "setPool",
    // 	data: {
    // 		pool: "C",
    // 		id: "1"
    // 	}
    // }
    // const data = {
    // 	method: "calculateRatings"
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
    const data = {
        method: "getMatches",
        data: {}
    };
    const signature = hmacSha256Base64(TOKEN, JSON.stringify(data));
    const result = doPost({
        postData: {
            contents: JSON.stringify({
                ...data,
                signature
            })
        }
    });
    console.log("result", result.getContent());
}
