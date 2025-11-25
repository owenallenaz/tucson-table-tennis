import { isNode } from "./constants.js";

export default function hmacSha256Base64(secret: string, data: string): string {
	return isNode ? hmacSha256Base64Node(secret, data) : hmacSha256Base64AS(secret, data);
}

function hmacSha256Base64Node(secret: string, data: string): string {
	const crypto = require("crypto");
	return crypto.createHmac("sha256", secret).update(data, "utf8").digest("base64");
}

function hmacSha256Base64AS(secret: string, data: string): string {
	const sig = Utilities.computeHmacSha256Signature(data, secret);
	return Utilities.base64Encode(sig);
}
