'use strict';

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

function test$1() {
  calculateMatches(["a", "b", "c"]);
  return "foo";
}

// function methodTest(e, data) {
// 	const ss = SpreadsheetApp.getActiveSpreadsheet();
// 	const sheet = ss.getSheetByName("matches");
// 	if (!sheet) {
// 		throw new Error("Sheet not found.");
// 	}

const methods = {
  test: test$1
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
  const result = method(e, data.data);
  return ContentService.createTextOutput(JSON.stringify(result));
}
function test() {
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        method: "test",
        data: {
          something: "foo"
        }
      })
    }
  });
  console.log("result", result.getContent());
}
