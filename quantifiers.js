function handleQuantifiers(regex, index) {
  switch (regex[index]) {
    case "*":
      return " zero or more times";
    case "+":
      return " one or more times";
    case "?":
      return " zero or one time";
    case "{":
      // if the character after { is not a number
      if (isNaN(regex[index + 1])) {
        return "";
      } else {
        switch (regex[index + 2]) {
          case "}":
            // e.g. {3}
            return ` ${regex[index + 1]} times`;
          case ",":
            // e.g. {3,}
            if (regex[index + 3] === "}") {
              return ` at least ${regex[index + 1]} times`;
            } else if (!isNaN(regex[index + 3]) && regex[index + 4] === "}") {
              // e.g. {3,5}
              if (regex[index + 1] < regex[index + 3]) {
                return ` between ${regex[index + 1]} and ${
                  regex[index + 3]
                } times`;
              } else {
                // Invalid regular expression
                return `Invalid regular expression, {${regex[index + 1]}, ${
                  regex[index + 3]
                }}.  You cannot define a range where the lower range (${
                  regex[index + 1]
                }) is greater than higher range (${regex[index + 3]})`;
              }
            }
          default:
            return "";
        }
      }
    default:
      return "";
  }
}

module.exports = handleQuantifiers;
