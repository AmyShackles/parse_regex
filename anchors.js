const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function anchors(regex) {
  if (regex[regex.length - 1] === "$" && regex[0] === "^") {
    regex.shift();
    regex.pop();
    return `to the start and end of the line`;
  } else if (regex[regex.length - 1] === "$") {
    regex.pop();
    return `to the end of the line`;
  } else if (regex[0] === "^") {
    regex.shift();
    return `to the start of the line`;
  } else {
    if (regex.includes("$") || regex.includes("^")) {
      try {
        return areAnchorsValid(regex);
      } catch (error) {
        return error;
      }
    }
  }
}

function areAnchorsValid(regex) {
  /*
    A regular expression is invalid if ^ appears as the last character
    or if $ appears as the first character if there are other characters
  */
  if (regex.length > 1) {
    if (regex[0] === "$" && regex[regex.length - 1] === "^") {
      throw new InvalidRegularExpression(
        "Regular expression cannot start with an end of string anchor and cannot end with a start of string anchor"
      );
    } else if (regex[regex.length - 1] === "^") {
      throw new InvalidRegularExpression(
        "Regular expression cannot end with a start of string anchor"
      );
    } else if (regex[0] === "$") {
      throw new InvalidRegularExpression(
        "Regular expression cannot start with an end of string anchor"
      );
    }
  }
  // $ and ^ are still valid if they are escaped
  // or if they appear in a character set
  let occurenceMap = indexesOf(regex, /\^|\$|\[|\]/g);
  const {
    "^": carats = [],
    $: dollars = [],
    "[": openBrackets = [],
    "]": closedBrackets = [],
  } = occurenceMap;
  /*
    We want to remove instances where the character has been escaped
    before we look for them in character sets
  */
  const unEscapedCarats = removeEscapedIndices(regex, carats);
  const unEscapedDollars = removeEscapedIndices(regex, dollars);
  /*
    We also have to ensure that the symbols for the start and end
    of a character set aren't escpaed before relying on them to
    check the validity of anchor symbols
  */
  const characterSetStart = removeEscapedIndices(regex, openBrackets);
  const characterSetEnd = removeEscapedIndices(regex, closedBrackets);

  /* 
    If the number of unescaped opening brackets is not equal
    to the number of unescaped closing brackets, 
    we have an invalid regular expression
  */
  if (characterSetStart.length !== characterSetEnd.length) {
    throw new InvalidRegularExpression(
      'The number of unescaped opening square brackets "[" is not equal to the number of unescaped closing square brackets "]", which makes this regular expression invalid.'
    );
  }

  /*
    If there are no character sets and there are unescaped
    carats or dollars, we know we have an invalid regex
  */

  if (characterSetStart.length === 0 && unEscapedCarats.length > 0) {
    throw new InvalidRegularExpression(
      "The ^ is a special character in regular expressions.  You either need to include it at the very beginning of the regular expression, inside of a character set (e.g, [^]), or escape it, (e.g., \\^)."
    );
  }
  if (characterSetStart.length === 0 && unEscapedDollars.length > 0) {
    throw new InvalidRegularExpression(
      "The $ is a special character in regular expressions.  You either need to include it at the very end of the regular expression, inside of a character set (e.g., [$]), or escape it (e.g., \\$)."
    );
  }
  let areCaratsValid = true;
  let areDollarsValid = false;
  if (unEscapedCarats.length > 0) {
    arCaratsValid = checkValidity(
      unEscapedCarats,
      characterSetStart,
      characterSetEnd
    );
  }
  if (unEscapedDollars.length > 0) {
    areDollarsValid = checkValidity(
      unEscapedDollars,
      characterSetStart,
      characterSetEnd
    );
  }

  return areDollarsValid && areCaratsValid;
}
function removeEscapedIndices(regex, indices) {
  return indices.filter((index) => !isItEscaped(regex, index));
}
function isItEscaped(regex, index) {
  if (regex[index - 1] === "\\") {
    return true;
  }
  return false;
}
function checkValidity(anchorIndices, characterSetStarts, characterSetEndings) {
  let anchorIndex = 0;
  while (anchorIndex < anchorIndices.length) {
    let characterSetIndex = 0;
    /*
      Find the first index in the characterSet arrays where
      the anchor has a chance of residing
    */
    while (
      characterSetEndings[characterSetIndex] < anchorIndices[anchorIndex]
    ) {
      characterSetIndex++;
    }
    if (
      anchorIndices[anchorIndex] > characterSetStarts[characterSetIndex] &&
      characterSetEndings[characterSetIndex] > anchorIndices[anchorIndex]
    ) {
      anchorIndex++;
    } else {
      return false;
    }
  }
  /*
    If we get through the entire array without returning false,
    we know that all instances fall within a character set
    and are therefore valid
  */
  return true;
}

function indexesOf(string, regex) {
  var match,
    indexes = {};

  regex = new RegExp(regex);

  while ((match = regex.exec(string))) {
    if (!indexes[match[0]]) indexes[match[0]] = [];
    indexes[match[0]].push(match.index);
  }
  return indexes;
}

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

module.exports = {
  anchors,
  areAnchorsValid,
  removeEscapedIndices,
  isItEscaped,
  checkValidity,
  indexesOf,
};
