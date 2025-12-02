import getSheetByName from "../getSheetByName.js";
export default function setPool(e, data) {
    if (data.id === undefined) {
        throw new Error("Must specify id");
    }
    if (data.pool === undefined) {
        throw new Error("Must specify pool");
    }
    const sheet = getSheetByName("Roster");
    const lastRow = sheet.getLastRow();
    const values = sheet.getRange(`A2:A${lastRow}`).getValues();
    for (const [index, value] of Object.entries(values)) {
        if (value[0].toString() === data.id) {
            sheet.getRange(`D${Number(index) + 2}`).setValue(data.pool);
            return { success: true };
        }
    }
    throw new Error(`id '${data.id}' not found`);
}
