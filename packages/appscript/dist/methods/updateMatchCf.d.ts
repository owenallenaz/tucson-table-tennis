import type SheetsApi from "../SheetsApi.js";
interface UpdateMatchArgs {
    tournament: string;
    row: number;
    aWins: number;
    bWins: number;
}
export default function updateMatchCf(api: SheetsApi, data: UpdateMatchArgs): Promise<{
    success: boolean;
}>;
export {};
