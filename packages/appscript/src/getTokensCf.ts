import { ADMIN_SHEET, TOKEN_CELL, TOKEN_CELL_ADMIN } from "./constants.js";
import type SheetsApi from "./SheetsApi.js";

export default async function getTokensCf(api: SheetsApi) {
	const data = await api.readRange(`${ADMIN_SHEET}!${TOKEN_CELL}:${TOKEN_CELL_ADMIN}`);
	return {
		token: data[0][0],
		adminToken: data[0][1]
	}
}
