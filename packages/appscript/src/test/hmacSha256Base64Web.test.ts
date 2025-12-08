import { strictEqual } from "assert";
import hmacSha256Base64 from "src/hmacSha256Base64Web.js";

describe(__filename, function() {
	it("should encode a string", async function() {
		const result = await hmacSha256Base64("secret", "test2");
		strictEqual(result, "9TpPNnsorxe8U99HeujuJZCxhfQ51Yz9oD7PBWs/Yjs=");
	})
});
