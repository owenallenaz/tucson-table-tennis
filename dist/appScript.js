'use strict';

const isNode = typeof process !== "undefined" && !!(process.versions && process.versions.node);
const isAppsScript = typeof Utilities !== "undefined" && typeof Utilities.base64Encode === "function";
const TOKEN = "tttc";

function hmacSha256Base64(secret, data) {
  return isNode ? hmacSha256Base64Node(secret, data) : hmacSha256Base64AS(secret, data);
}
function hmacSha256Base64Node(secret, data) {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", secret).update(data, "utf8").digest("base64");
}
function hmacSha256Base64AS(secret, data) {
  const sig = Utilities.computeHmacSha256Signature(data, secret);
  return Utilities.base64Encode(sig);
}

function test$1() {
  return "foo" + isNode + isAppsScript;
}

function cleanValue(str) {
  return str === "" ? undefined : str;
}

function rawToRoster(raw) {
  return raw.map(val => {
    return {
      id: cleanValue(val[0]),
      name: cleanValue(val[1]),
      rating: cleanValue(val[2]),
      pool: cleanValue(val[3])
    };
  });
}

function getSheetByName(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error("Sheet not found.");
  }
  return sheet;
}

function getRoster() {
  const sheet = getSheetByName("Roster");
  const range = sheet.getRange("A2:D50").getValues();
  const filtered = range.filter(val => {
    return val[0] !== "";
  });
  return rawToRoster(filtered);
}

/**
 * Convert an array of player ids into a player vector for match creation purposes
*/
function createPlayerVector(ids) {
  const newIds = [...ids];
  if (newIds.length % 2 === 1) {
    newIds.push("bye");
  }
  const topRow = newIds.splice(0, newIds.length / 2);
  return [topRow, newIds.reverse()];
}

/** For a given player vector return all matches for this round */
function getVectorMatches(vector) {
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
    result.push([playerA, playerB]);
  }
  return result;
}

/** Rotate the player vector to get next rounds matches */
function rotateVector(vector) {
  const row1 = [...vector[0]];
  const row2 = [...vector[1]];
  const fixed1 = row1.shift();
  const topRight = row1.pop();
  const bottomLeft = row2.shift();
  row1.unshift(bottomLeft);
  row1.unshift(fixed1);
  row2.push(topRight);
  return [row1, row2];
}

/** For an array of player ids calculate all matches in the order they should be played */
function calculateMatches(ids) {
  let vector = createPlayerVector(ids);
  const matchCount = ids.length / 2 * (ids.length - 1);
  const allMatches = [];
  while (allMatches.length < matchCount) {
    const matches = getVectorMatches(vector);
    allMatches.push(...matches);
    vector = rotateVector(vector);
  }

  // sort the matches so that the match itself is listed in low-seed order
  const sortedMatches = allMatches.map(val => {
    const playerAIndex = ids.indexOf(val[0]);
    const playerBIndex = ids.indexOf(val[1]);
    if (playerAIndex < playerBIndex) {
      return [val[0], val[1]];
    } else {
      return [val[1], val[0]];
    }
  });
  return sortedMatches;
}

function createMatchesFromRoster() {
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
    pools[player.pool].push(player.id);
  }
  const rawData = [];
  for (const [pool, ids] of Object.entries(pools)) {
    const matches = calculateMatches(ids);
    matches.forEach(val => {
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

function setPool(e, data) {
  if (data.id === undefined) {
    throw new Error("Must specify id");
  }
  if (data.pool === undefined) {
    throw new Error("Must specify pool");
  }
  const sheet = getSheetByName("Roster");
  const lastRow = sheet.getLastRow();
  const values = sheet.getRange(`A2:A${lastRow}`).getValues();
  console.log("values", values);
  for (const [index, value] of Object.entries(values)) {
    if (value[0].toString() === data.id) {
      sheet.getRange(`D${Number(index) + 2}`).setValue(data.pool);
      return {
        success: true
      };
    }
  }
  throw new Error(`id '${data.id}' not found`);
}

const methods = {
  test: test$1,
  createMatchesFromRoster,
  getRoster,
  setPool
};
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (!data.method) {
    throw new Error("Must pass JSON data and declare a method");
  }
  const method = methods[data.method];
  if (!method) {
    throw new Error(`Invalid method '${data.method}', must be one of ${Object.keys(methods).join(", ")}.`);
  }
  const packet = {
    method: data.method,
    data: data.data
  };
  const expectedSig = hmacSha256Base64(TOKEN, JSON.stringify(packet));
  if (expectedSig !== data.signature) {
    throw new Error(`Invalid authentication, user not authorized.`);
  }
  const result = method(e, data.data);
  return ContentService.createTextOutput(JSON.stringify(result));
}
function test() {
  // const data = {
  // 	method: "createMatchesFromRoster",
  // 	data: {}
  // }
  const data = {
    method: "setPool",
    data: {
      pool: "C",
      id: "1"
    }
  };
  const signature = hmacSha256Base64(TOKEN, JSON.stringify(data));
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        ...data,
        signature
      })
    }
  });
  console.log("result", result.getContent());
}
