import getSheetByName from "../getSheetByName.js";
import getRoster from "./getRoster.js";
import calculateMatches from "../calculateMatches.js";
export default function createMatchesFromRoster() {
    const roster = getRoster();
    const sheet = getSheetByName("Matches");
    const pools = {};
    for (const player of roster) {
        if (!player.pool) {
            continue;
        }
        if (!player.id) {
            continue;
        }
        if (pools[player.pool] === undefined) {
            pools[player.pool] = [];
        }
        ;
        pools[player.pool].push(player.id);
    }
    const rawData = [];
    for (const [pool, ids] of Object.entries(pools)) {
        const matches = calculateMatches(ids);
        matches.forEach((val) => {
            rawData.push([pool, val[0], val[1]]);
        });
    }
    sheet.getRange("A2:E100").setValue("");
    if (rawData.length === 0) {
        return;
    }
    sheet.getRange(`A2:C${rawData.length + 1}`).setValues(rawData);
    return rawData;
}
