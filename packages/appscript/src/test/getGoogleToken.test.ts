import getGoogleToken from "../getGoogleToken.js";
import ok from "src/ok.js";

const {
	GOOGLE_CLIENT_EMAIL,
	GOOGLE_PRIVATE_KEY
} = process.env;

ok(GOOGLE_CLIENT_EMAIL);
ok(GOOGLE_PRIVATE_KEY);

describe(__filename, function() {
	it("should load a google token", async function() {
		const token = await getGoogleToken(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);
		ok(token);
	});
});
