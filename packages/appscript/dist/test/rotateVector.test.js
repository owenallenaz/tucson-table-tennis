import rotateVector from "src/rotateVector.js";
import { testArray } from "@simpleview/mochalib";
import { deepStrictEqual } from "assert";
describe(__filename, function () {
    const tests = [
        {
            name: "4 player",
            args: {
                players: [
                    ["1", "2"],
                    ["4", "3"]
                ],
                result: [
                    ["1", "4"],
                    ["3", "2"]
                ]
            }
        },
        {
            name: "6 player",
            args: {
                players: [
                    ["1", "2", "3"],
                    ["4", "5", "6"]
                ],
                result: [
                    ["1", "4", "2"],
                    ["5", "6", "3"]
                ]
            }
        },
        {
            name: "8 player",
            args: {
                players: [
                    ["1", "2", "3", "4"],
                    ["5", "6", "7", "8"]
                ],
                result: [
                    ["1", "5", "2", "3"],
                    ["6", "7", "8", "4"]
                ]
            }
        }
    ];
    testArray(tests, function (test) {
        const result = rotateVector(test.players);
        deepStrictEqual(result, test.result);
    });
});
