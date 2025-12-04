import { APP_URL } from "../constants";
import hmacSha256Base64 from "#lib/hmacSha256Base64";

export default async function callGas(method: string, data: object) {
	const content = {
		method,
		data
	}

	const signature = await hmacSha256Base64("tttc", JSON.stringify(content));

	const response = await fetch(APP_URL, {
		method: "post",
		body: JSON.stringify({
			...content,
			signature
		})
	});

	const responseData = await response.json();

	return responseData;
}
