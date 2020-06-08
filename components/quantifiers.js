const InvalidRegularExpression = require("./InvalidRegularExpression.js");

const quantity = {
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
};

function handleQuantifiers(regex, index) {
  switch (regex[index]) {
    case "*":
      return [" zero or more times", index];
    case "+":
      return [" one or more times", index];
    case "?":
      return [" zero or one time", index];
    case "{":
      if (isNaN(regex[index + 1])) {
        return ["", index];
      }
      let endOfStartIndex = index + 1;
      while (!isNaN(regex[endOfStartIndex])) {
        endOfStartIndex++;
      }
      const startingRange = regex.slice(index + 1, endOfStartIndex);
      if (regex[endOfStartIndex] === "}") {
        // e.g. {3}
        if (startingRange.length > 1 || quantity[startingRange] === undefined) {
          return [` ${startingRange} times`, endOfStartIndex];
        } else {
          return [` ${quantity[regex[index + 1]]} times`, endOfStartIndex];
        }
      }
      if (
        regex[endOfStartIndex] === "," &&
        regex[endOfStartIndex + 1] === "}"
      ) {
        // e.g. {3,}
        if (startingRange.length > 1 || quantity[startingRange] === undefined) {
          return [` at least ${startingRange} times`, endOfStartIndex + 1];
        } else {
          return [` at least ${quantity[regex[index + 1]]} times`, index + 3];
        }
      }
      const endOfEndIndex = regex.indexOf("}", endOfStartIndex);
      const endingRange = regex.slice(endOfStartIndex + 1, endOfEndIndex);

      if (!isNaN(endingRange)) {
        if (+startingRange < +endingRange) {
          // e.g. {3,5}
          if (
            endingRange.length > 1 ||
            quantity[endingRange] === undefined ||
            quantity[startingRange] === undefined
          ) {
            return [
              ` between ${startingRange} and ${endingRange} times`,
              endOfEndIndex,
            ];
          } else {
            return [
              ` between ${quantity[regex[index + 1]]} and ${
                quantity[regex[index + 3]]
              } times`,
              index + 4,
            ];
          }
        } else {
          // Invalid regular expression
          return [
            new InvalidRegularExpression(
              `Invalid regular expression, {${startingRange}, ${endingRange}}.  You cannot define a range where the lower range (${startingRange}) is greater than higher range (${endingRange})`
            ),
          ];
        }
      }
    default:
      return ["", index - 1];
  }
}

module.exports = { handleQuantifiers };
