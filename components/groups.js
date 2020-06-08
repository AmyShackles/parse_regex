const { handleQuantifiers } = require("./quantifiers.js");
const { parseBackslash } = require("./backSlash.js");
const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function handleGroup(regex, startingIndex) {
  let group = [];
  let i = startingIndex;
  let negated = false;
  if (regex[i] === "^") {
    negated = true;
    ++i;
  }
  while (regex[i] !== "]") {
    switch (regex[i]) {
      case "-":
        if (
          regex[i - 1].match(/[0-9a-zA-Z]/) &&
          regex[i + 1].match(/[0-9a-zA-Z]/)
        ) {
          group[group.length - 1] = `"any of ${
            group[group.length - 1]
          } through '${regex[++i]}'"`;
        } else {
          // If it's not a valid range, we want to include the hyphen in the group
          group.push(`'${regex[i]}'`);
          // Need to increment the index because otherwise it will infinite loop matching on '-'
          group.push(`'${regex[++i]}'`);
        }
        break;
      case "\\":
        const escapedChar = parseBackslash(regex[++i]);
        if (escapedChar !== undefined) {
          group.push(escapedChar);
        }
        break;
      default:
        group.push(`'${regex[i]}'`);
    }
    i++;
  }
  let [quantifiers, index] = handleQuantifiers(regex, i + 1);
  if (quantifiers instanceof InvalidRegularExpression) {
    return [`${quantifiers.name}: ${quantifiers.message}`];
  }
  if (group.length > 0) {
    if (negated === true) {
      return quantifiers
        ? [`"not any of ${group.join(" or ")}${quantifiers}"`, index]
        : [`"not any of ${group.join(" or ")}"`, index];
    }
    return quantifiers
      ? [`'${group.join(` or `)}${quantifiers}`, index]
      : [`${group.join(` or `)}`, index];
  } else {
    return [quantifiers, index];
  }
}

module.exports = handleGroup;
