import type SheetsApi from "./SheetsApi.js";
export default function getTokensCf(api: SheetsApi): Promise<{
    token: string;
    adminToken: string;
}>;
