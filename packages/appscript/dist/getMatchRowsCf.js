import rawToMatches from "./rawToMatches.js";
import { MATCH_SHEET } from "./constants.js";
export default async function getMatchRowsCf(api, tournament) {
    const raw = await api.readRange(`${MATCH_SHEET}_${tournament}!A2:G`);
    const matchRows = rawToMatches(raw);
    return matchRows;
}
