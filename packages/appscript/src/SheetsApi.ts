const apiBase = `https://sheets.googleapis.com/v4/spreadsheets`;

type SheetCell = string | null

export default class SheetsApi {
	#sheet: string
	#token: string
	constructor({
		token,
		sheet
	}: {
		token: string
		sheet: string
	}) {
		this.#token = token;
		this.#sheet = sheet;
	}
	async readRange(range: string): Promise<string[][]> {
		const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}`;

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.#token}`
			}
		});

		const data = await res.json() as { values: string[][] };
		return data.values || [];
	}
	async updateRange(range: string, values: SheetCell[][]) {
		const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

		const body = {
			values
		}

		await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${this.#token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});
	}
	async clearRange(range: string) {
		const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}:clear`;
		await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${this.#token}`,
				"Content-Type": "application/json"
			}
		});
	}
}
