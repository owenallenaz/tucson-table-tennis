import getMatchRowsCf from "../getMatchRowsCf.js";
export default async function getMatchesCf(api, data) {
    if (data.tournament === undefined) {
        throw new Error("Must specify tournament");
    }
    return getMatchRowsCf(api, data.tournament);
}
