import type { Match } from "./types.js";
/** For an array of player ids calculate all matches in the order they should be played */
export default function calculateMatches(ids: string[]): Match[];
