import { ADMIN_SHEET, TOKEN_CELL, TOKEN_CELL_ADMIN } from "./constants.js";
import getSheetByName from "./getSheetByName.js";
export default function getTokens() {
    const sheet = getSheetByName(ADMIN_SHEET);
    const token = sheet.getRange(TOKEN_CELL).getValue();
    const adminToken = sheet.getRange(TOKEN_CELL_ADMIN).getValue();
    return {
        token,
        adminToken
    };
}
