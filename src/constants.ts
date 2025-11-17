export const isNode = typeof process !== "undefined" && !!(process.versions && process.versions.node);
export const isAppsScript = typeof Utilities !== "undefined" && typeof Utilities.base64Encode === "function";
export const TOKEN = "tttc";
