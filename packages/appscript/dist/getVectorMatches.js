/** For a given player vector return all matches for this round */
export default function getVectorMatches(vector) {
    const result = [];
    const topRow = [...vector[0]];
    const bottomRow = [...vector[1]];
    const row = [...topRow, ...bottomRow.reverse()];
    while (row.length > 0) {
        const playerA = row.shift();
        const playerB = row.pop();
        if (playerA === "bye" || playerB === "bye") {
            continue;
        }
        if (!playerA || !playerB) {
            throw new Error("Invalid row");
        }
        result.push([playerA, playerB]);
    }
    return result;
}
