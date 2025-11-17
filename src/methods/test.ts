import { isNode, isAppsScript } from "../constants.js";

export default function test() {
	return "foo" + isNode + isAppsScript;
}
