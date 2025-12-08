import { deepStrictEqual } from "assert";
import getGoogleToken from "src/getGoogleToken.js";
import ok from "src/ok.js";
import SheetsApi from "src/SheetsApi.js";
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SHEET_ID } = process.env;
ok(GOOGLE_CLIENT_EMAIL);
ok(GOOGLE_PRIVATE_KEY);
ok(SHEET_ID);
let api;
describe(__filename, function () {
    before(async () => {
        api = new SheetsApi({
            token: await getGoogleToken(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY),
            sheet: SHEET_ID
        });
    });
    it("should readRange", async function () {
        const data = await api.readRange("test!A1");
        deepStrictEqual(data, [["A1Value"]]);
        const data2 = await api.readRange("test!A1:B2");
        deepStrictEqual(data2, [
            ["A1Value", "B1Value"],
            ["A2Value", "B2Value"]
        ]);
    });
    it("should read incomplete range", async function () {
        await api.clearRange("test!C1:D4");
        await api.updateRange("test!C1:D4", [
            ["a", null],
            [null, "b"],
            [null, null],
            ["1", "2"]
        ]);
        const data = await api.readRange("test!C1:D4");
        deepStrictEqual(data, [
            ["a"],
            ["", "b"],
            [],
            ["1", "2"]
        ]);
    });
    it("should updateRange", async function () {
        await api.updateRange("test!A3:B4", [
            ["A", "B"],
            ["C", "D"]
        ]);
        const data = await api.readRange("test!A3:B4");
        deepStrictEqual(data, [
            ["A", "B"],
            ["C", "D"]
        ]);
    });
});
