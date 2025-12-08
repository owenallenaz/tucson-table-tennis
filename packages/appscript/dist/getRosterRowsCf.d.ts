import type SheetsApi from "./SheetsApi.js";
import type { RosterRow } from "./types.js";
export default function getRosterRowsCf(api: SheetsApi, tournament: string): Promise<RosterRow[]>;
