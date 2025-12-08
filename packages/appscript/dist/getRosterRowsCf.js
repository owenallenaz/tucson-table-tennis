import { ROSTER_SHEET } from "./constants.js";
import rawToRoster from "./rawToRoster.js";
export default async function getRosterRowsCf(api, tournament) {
    const raw = await api.readRange(`${ROSTER_SHEET}_${tournament}!A2:G`);
    return rawToRoster(raw);
}
