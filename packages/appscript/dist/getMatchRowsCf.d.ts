import type { MatchRow } from "./types.js";
import type SheetsApi from "./SheetsApi.js";
export default function getMatchRowsCf(api: SheetsApi, tournament: string): Promise<MatchRow[]>;
