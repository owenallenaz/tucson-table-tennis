import { ADMIN_SHEET, TOKEN_CELL } from "./constants.js";
import getSheetByName from "./getSheetByName.js";
export default function getToken() {
    const sheet = getSheetByName(ADMIN_SHEET);
    const token = sheet.getRange(TOKEN_CELL).getValue();
    return token;
}
