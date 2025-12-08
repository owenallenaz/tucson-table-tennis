import getRosterRowsCf from "../getRosterRowsCf.js";
export default async function getRosterCf(api, data) {
    if (data.tournament === undefined) {
        throw new Error("Must specify tournament");
    }
    return getRosterRowsCf(api, data.tournament);
}
