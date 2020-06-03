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
      // if the character after { is not a number
      if (isNaN(regex[index + 1])) {
        return ["", index + 1];
      } else {
        switch (regex[index + 2]) {
          case "}":
            // e.g. {3}
            return [
              ` ${
                quantity[regex[index + 1]]
                  ? quantity[regex[index + 1]]
                  : regex[index + 1]
              } times`,
              index + 2,
            ];
          case ",":
            // e.g. {3,}
            if (regex[index + 3] === "}") {
              return [
                ` at least ${
                  quantity[regex[index + 1]]
                    ? quantity[regex[index + 1]]
                    : regex[index + 1]
                } times`,
                index + 3,
              ];
            } else if (!isNaN(regex[index + 3]) && regex[index + 4] === "}") {
              // e.g. {3,5}
              if (regex[index + 1] < regex[index + 3]) {
                return [
                  ` between ${
                    quantity[regex[index + 1]]
                      ? quantity[regex[index + 1]]
                      : regex[index + 1]
                  } and ${
                    quantity[regex[index + 3]]
                      ? quantity[regex[index + 3]]
                      : regex[index + 3]
                  } times`,
                  index + 4,
                ];
              } else {
                // Invalid regular expression
                return [
                  new InvalidRegularExpression(
                    `Invalid regular expression, {${regex[index + 1]}, ${
                      regex[index + 3]
                    }}.  You cannot define a range where the lower range (${
                      regex[index + 1]
                    }) is greater than higher range (${regex[index + 3]})`
                  ),
                ];
              }
            }
          default:
            return ["", index + 2];
        }
      }
    default:
      // If there is no quantifier
      // we need to return the previous index
      // because the index will be incremented
      // before being checked
      return ["", index - 1];
  }
}

function handleRangeQuantifiers(regex, index) {
  if (isNaN(regex[index + 1])) {
    return ["", index + 1];
  }
  if (regex[index + 2] === "}") {
    // e.g. {3}
    return [
      ` ${
        quantity[regex[index + 1]]
          ? quantity[regex[index + 1]]
          : regex[index + 1]
      } times`,
      index + 2,
    ];
  }
  if (regex[index + 2] === "," && regex[index + 3] === "}") {
    // e.g. {3,}
    return [
      ` at least ${
        quantity[regex[index + 1]]
          ? quantity[regex[index + 1]]
          : regex[index + 1]
      } times`,
      index + 3,
    ];
  }
  if (
    !isNaN(regex[index + 3]) &&
    regex[index + 4] === "}" &&
    regex[index + 1] < regex[index + 3]
  ) {
    // e.g. {3,5}
    return [
      `  between ${
        quantity[regex[index + 1]]
          ? quantity[regex[index + 1]]
          : regex[index + 1]
      } and ${
        quantity[regex[index + 3]]
          ? quantity[regex[index + 3]]
          : regex[index + 3]
      } times`,
      index + 4,
    ];
  }
  // Invalid regular expression
  return [
    new InvalidRegularExpression(
      `Invalid regular expression, {${regex[index + 1]}, ${
        regex[index + 3]
      }}.  You cannot define a range where the lower range (${
        regex[index + 1]
      }) is greater than higher range (${regex[index + 3]})`
    ),
  ];
}

module.exports = { handleQuantifiers, handleRangeQuantifiers };
