const apiBase = `https://sheets.googleapis.com/v4/spreadsheets`;
export default class SheetsApi {
    #sheet;
    #token;
    constructor({ token, sheet }) {
        this.#token = token;
        this.#sheet = sheet;
    }
    async readRange(range) {
        const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.#token}`
            }
        });
        const data = await res.json();
        return data.values || [];
    }
    async updateRange(range, values) {
        const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
        const body = {
            values
        };
        await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${this.#token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }
    async clearRange(range) {
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
