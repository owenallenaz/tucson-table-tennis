export default async function hmacSha256Base64(key: string, str: string) {
	const enc = new TextEncoder();
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		enc.encode(key),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);

	const signature = await crypto.subtle.sign(
		"HMAC",
		cryptoKey,
		enc.encode(str)
	);

	return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
