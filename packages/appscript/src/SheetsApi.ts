import getGoogleToken from "./getGoogleToken.js";

export default class SheetsApi {
	#email: string
	#privateKey: string
	#sheet: string
	#token?: string
	constructor({
		email,
		privateKey,
		sheet
	}: {
		email: string
		privateKey: string
		sheet: string
	}) {
		this.#email = email;
		this.#privateKey = privateKey;
		this.#sheet = sheet;
	}
	async readRange(range: string): Promise<string[][]> {
		const token = await this.#getToken();

		const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.#sheet}/values/${encodeURIComponent(range)}`;

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const data = await res.json() as { values: string[][] };
		return data.values || [];
	}
	async updateRange(range: string, values: string[][]) {
		const token = await this.#getToken();
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.#sheet}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

		const body = {
			values
		}

		await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});
	}
	async #getToken(): Promise<string> {
		if (this.#token) { return this.#token; }

		this.#token = await getGoogleToken(this.#email, this.#privateKey);
		return this.#token;
	}
}
