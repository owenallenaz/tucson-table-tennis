import createPlayerVector from "src/createPlayerVector.js";
import { testArray } from "@simpleview/mochalib";
import { deepStrictEqual } from "assert";
describe(__filename, function () {
    const tests = [
        {
            name: "4 player",
            args: {
                players: ["1", "2", "3", "4"],
                result: [
                    ["1", "2"],
                    ["4", "3"]
                ]
            }
        },
        {
            name: "5 player",
            args: {
                players: ["1", "2", "3", "4", "5"],
                result: [
                    ["1", "2", "3"],
                    ["bye", "5", "4"]
                ]
            }
        },
        {
            name: "6 player",
            args: {
                players: ["1", "2", "3", "4", "5", "6"],
                result: [
                    ["1", "2", "3"],
                    ["6", "5", "4"]
                ]
            }
        }
    ];
    testArray(tests, function (test) {
        const result = createPlayerVector(test.players);
        deepStrictEqual(result, test.result);
    });
});
