import cleanString from "./cleanString.js";
import cleanNumber from "./cleanNumber.js";
import cleanBoolean from "./cleanBoolean.js";
export default function rawToRoster(raw) {
    const roster = [];
    for (const [i, val] of Object.entries(raw)) {
        const id = cleanString(val[0]);
        const name = cleanString(val[1]);
        const rating = cleanNumber(val[2]);
        const pool = cleanString(val[3]);
        const newRating = cleanNumber(val[4]);
        const delta = cleanNumber(val[5]);
        const playing = cleanBoolean(val[6]);
        if (id === undefined || name === undefined || rating === undefined) {
            continue;
        }
        roster.push({
            row: Number(i) + 2,
            id,
            name,
            rating,
            pool,
            newRating,
            delta,
            playing
        });
    }
    return roster;
}
