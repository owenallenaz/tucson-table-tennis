import { importPKCS8, SignJWT } from "jose";

export default async function getGoogleToken(email: string, privateKey: string) {
	// Google expects RS256-signed JWT with specific claims :contentReference[oaicite:2]{index=2}
	const now = Math.floor(Date.now() / 1000);

	// const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // handle escaped newlines
	const alg = 'RS256';

	const key = await importPKCS8(privateKey, alg);

	const jwt = await new SignJWT({
		scope: 'https://www.googleapis.com/auth/spreadsheets',
	})
		.setProtectedHeader({ alg })
		.setIssuer(email)
		.setSubject(email)
		.setAudience('https://oauth2.googleapis.com/token')
		.setIssuedAt(now)
		.setExpirationTime(now + 3600)
		.sign(key)
	;

	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: jwt,
		}),
	});

	if (!res.ok) {
		const txt = await res.text();
		throw new Error(`Token request failed: ${res.status} ${txt}`);
	}

	const json = await res.json() as { access_token: string };
	return json.access_token;
}
