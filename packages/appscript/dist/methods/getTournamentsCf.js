import SheetsApi from "src/SheetsApi.js";
import { ADMIN_SHEET, TOURNAMENTS_COLUMN } from "../constants.js";
export default async function getTournamentsCf(api) {
    const data = await api.readRange(`${ADMIN_SHEET}!${TOURNAMENTS_COLUMN}2:${TOURNAMENTS_COLUMN}`);
    return data.flat().filter(val => val !== "");
}
