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
  return str === "" ? undefined : str.toString();
}

function cleanNumber(str) {
  return str === "" ? undefined : Number(str);
}

function rawToRoster(raw) {
  const roster = [];
  for (const val of raw) {
    const id = cleanValue(val[0]);
    const name = cleanValue(val[1]);
    const rating = cleanNumber(val[2]);
    const pool = cleanValue(val[3]);
    if (id === undefined || name === undefined || rating === undefined) {
      continue;
    }
    roster.push({
      id,
      name,
      rating,
      pool
    });
  }
  return roster;
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
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(`A2:D${lastRow}`).getValues();
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
    if (!playerA || !playerB) {
      throw new Error("Invalid row");
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

function rawToMatches(raw) {
  const rows = [];
  for (const val of raw) {
    const pool = cleanValue(val[0]);
    const idA = cleanValue(val[1]);
    const idB = cleanValue(val[2]);
    const aWins = cleanNumber(val[3]);
    const bWins = cleanNumber(val[4]);
    if (pool === undefined || idA === undefined || idB === undefined || aWins === undefined || bWins === undefined) {
      continue;
    }
    rows.push({
      pool,
      idA,
      idB,
      aWins,
      bWins
    });
  }
  return rows;
}

function ok(value) {
  if (value === undefined) {
    throw new Error("Received undefined value");
  }
}

/**
 * Convert an array of players into a map of id to rating
*/
function getMap(players) {
  const map = new Map();
  for (const player of players) {
    map.set(player.id, player.rating);
  }
  return map;
}

/** Process the point conversion from a winner USATT rating to a loser USATT rating */
function calculatePoints(winner, loser) {
  const diff = winner - loser;
  let points;
  if (diff >= 0 && diff <= 12) {
    points = 8;
  } else if (diff >= 13 && diff <= 37) {
    points = 7;
  } else if (diff >= 38 && diff <= 62) {
    points = 6;
  } else if (diff >= 63 && diff <= 87) {
    points = 5;
  } else if (diff >= 88 && diff <= 112) {
    points = 4;
  } else if (diff >= 113 && diff <= 137) {
    points = 3;
  } else if (diff >= 138 && diff <= 187) {
    points = 2;
  } else if (diff >= 188 && diff <= 237) {
    points = 1;
  } else if (diff >= 287) {
    points = 0;
  }
  if (points !== undefined) {
    return points;
  }
  const iDiff = Math.abs(diff);
  if (iDiff >= 0 && iDiff <= 12) {
    points = 8;
  } else if (iDiff >= 13 && iDiff <= 37) {
    points = 10;
  } else if (iDiff >= 38 && iDiff <= 62) {
    points = 13;
  } else if (iDiff >= 63 && iDiff <= 87) {
    points = 16;
  } else if (iDiff >= 88 && iDiff <= 112) {
    points = 20;
  } else if (iDiff >= 113 && iDiff <= 137) {
    points = 25;
  } else if (iDiff >= 138 && iDiff <= 162) {
    points = 30;
  } else if (iDiff >= 163 && iDiff <= 187) {
    points = 35;
  } else if (iDiff >= 188 && iDiff <= 212) {
    points = 40;
  } else if (iDiff >= 213 && iDiff <= 237) {
    points = 45;
  } else if (iDiff >= 238) {
    points = 50;
  } else {
    throw new Error("Should never happen.");
  }
  return points;
}

/**
 * Process an array of matches with an incoming RatingMap and return an update RatingMap
*/
function processMatches(matches, ratingMap) {
  const initialRatings = ratingMap;
  const newRatings = new Map(ratingMap);
  for (const match of matches) {
    const winnerRating = initialRatings.get(match.winner);
    const winnerCurrent = newRatings.get(match.winner);
    const loserRating = initialRatings.get(match.loser);
    const loserCurrent = newRatings.get(match.loser);
    if (winnerRating === undefined || loserRating === undefined || winnerCurrent === undefined || loserCurrent === undefined) {
      throw new Error(`Match exists with player not in players array.`);
    }
    const points = calculatePoints(winnerRating, loserRating);
    newRatings.set(match.winner, winnerCurrent + points);
    newRatings.set(match.loser, loserCurrent - points);
  }
  return newRatings;
}

function advancedPass3(id, p1Rating, matches, ratingMap) {
  let bestWin = 0;
  let worstLoss = Infinity;
  let hasLoss = false;
  const myMatches = [];
  for (const match of matches) {
    if (match.loser !== id && match.winner !== id) {
      continue;
    }
    myMatches.push(match);
    const winnerRating = ratingMap.get(match.winner);
    const loserRating = ratingMap.get(match.loser);
    ok(winnerRating);
    ok(loserRating);
    if (match.winner === id) {
      bestWin = Math.max(bestWin, loserRating);
    } else {
      hasLoss = true;
      worstLoss = Math.min(worstLoss, winnerRating);
    }
  }
  if (hasLoss) {
    const opponentAverage = (bestWin + worstLoss) / 2;
    return (p1Rating + opponentAverage) / 2;
  } else {
    return myMatches.reduce((prev, curr) => {
      const loserRating = ratingMap.get(curr.loser);
      ok(loserRating);
      return prev + loserRating;
    }, 0) / myMatches.length;
  }
}

function processPass3(matches, ratingMap) {
  const pass3Part1 = processMatches(matches, ratingMap);
  const pass3Part3 = new Map();
  for (const [id, p1Rating] of pass3Part1) {
    const initialRating = ratingMap.get(id);
    ok(initialRating);
    ok(p1Rating);
    const delta = p1Rating - initialRating;
    let p2Rating;
    if (delta < 50) {
      p2Rating = initialRating;
    } else if (delta <= 74) {
      p2Rating = p1Rating;
    } else {
      p2Rating = advancedPass3(id, p1Rating, matches, ratingMap);
    }
    const finalRating = p2Rating < initialRating ? initialRating : p2Rating;
    pass3Part3.set(id, finalRating);
  }
  return pass3Part3;
}

/**
 * Process an array of matches with an array of players and return an array of results
*/
function processTournament(matches, players) {
  const initialRatings = getMap(players);
  const pass3 = processPass3(matches, initialRatings);
  const pass4 = processMatches(matches, pass3);
  return Array.from(pass4).map(([id, rating]) => {
    const initialRating = initialRatings.get(id);
    ok(initialRating);
    return {
      id,
      initialRating,
      rating,
      delta: rating - initialRating
    };
  });
}

function calculateRatings() {
  const roster = getRoster();
  const sheet = getSheetByName("Matches");
  const lastRow = sheet.getLastRow();
  const values = sheet.getRange(`A2:E${lastRow}`).getValues();
  const matchRows = rawToMatches(values);
  const matches = matchRows.map(val => {
    const winner = val.aWins > val.bWins ? val.idA : val.idB;
    const loser = val.idA === winner ? val.idB : val.idA;
    return {
      winner,
      loser
    };
  });
  const result = processTournament(matches, roster);
  const rosterSheet = getSheetByName("Roster");
  const rosterLastRow = rosterSheet.getLastRow();
  const ids = rosterSheet.getRange(`A2:A${rosterLastRow}`).getValues().flat().map(val => val.toString());
  for (const row of result) {
    const idIndex = ids.indexOf(row.id);
    if (idIndex === -1) {
      continue;
    }
    const rowNumber = idIndex + 2;
    rosterSheet.getRange(`E${rowNumber}`).setValue(row.rating);
    rosterSheet.getRange(`F${rowNumber}`).setValue(row.delta);
  }
}

function addMatch(e, data) {
  const fields = ["idA", "idB", "aWins", "bWins"];
  for (const field of fields) {
    if (data[field] === undefined) {
      throw new Error(`Must specify ${field}`);
    }
  }
  const sheet = getSheetByName("Matches");
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;
  sheet.getRange(`B${newRow}:E${newRow}`).setValues([[data.idA, data.idB, data.aWins, data.bWins]]);
}

const methods = {
  addMatch,
  test: test$1,
  calculateRatings,
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
  // const data = {
  // 	method: "setPool",
  // 	data: {
  // 		pool: "C",
  // 		id: "1"
  // 	}
  // }
  // const data = {
  // 	method: "calculateRatings"
  // }
  const data = {
    method: "addMatch",
    data: {
      idA: "1",
      idB: "2",
      aWins: 3,
      bWins: 2
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
