import type { MatchRow, MatchRowCompleted } from "@tttc/appscript/types";

export default function isMatchRowCompleted(match: MatchRow): match is MatchRowCompleted {
	return match.completed === true;
}
