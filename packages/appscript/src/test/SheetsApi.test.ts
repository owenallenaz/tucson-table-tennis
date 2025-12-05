import { deepStrictEqual } from "assert";
import ok from "src/ok.js";
import SheetsApi from "src/SheetsApi.js";

const {
	GOOGLE_CLIENT_EMAIL,
	GOOGLE_PRIVATE_KEY
} = process.env;

ok(GOOGLE_CLIENT_EMAIL);
ok(GOOGLE_PRIVATE_KEY);

const api = new SheetsApi({
	email: GOOGLE_CLIENT_EMAIL,
	privateKey: GOOGLE_PRIVATE_KEY,
	sheet: "1x2nKoEh3bWgTd2hR8gizGVinZ0sJXcxNW5jLeWYq_vs"
});

describe.only(__filename, function() {
	it("should readRange", async function() {
		const data = await api.readRange("test!A1");
		deepStrictEqual(data, [["A1Value"]]);
		const data2 = await api.readRange("test!A1:B2");
		deepStrictEqual(data2, [
			["A1Value", "B1Value"],
			["A2Value", "B2Value"]
		]);
	});

	it("should updateRange", async function() {
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
