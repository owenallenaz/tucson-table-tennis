import getGoogleToken from "./getGoogleToken.js";

const cacheMap = new Map<string, { token: string, expiration: number }>();

export default async function getTokenMemo(email, private_key) {
	const cached = cacheMap.get(email);
	if (cached && cached.expiration > Date.now()) {
		return cached.token;
	}

	const newToken = await getGoogleToken(email, private_key);
	cacheMap.set(email, { token: newToken, expiration: Date.now() + (1000 * 60 * 5) })

	return newToken;
}
