const handleQuantifiers = require("./quantifiers.js");
const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function handleGroup(regex, startingIndex) {
  let group = [];
  let i = startingIndex;
  while (regex[i] !== "]") {
    if (regex[i] === "-") {
      group[group.length - 1] = `"any of ${group[group.length - 1]} through ${
        regex[++i]
      }"`;
    } else {
      group.push(regex[i]);
    }
    i++;
  }
  let [quantifiers, index] = handleQuantifiers(regex, i + 1);
  if (quantifiers instanceof InvalidRegularExpression) {
    return [`${quantifiers.name}: ${quantifiers.message}`];
  }
  if (group.length > 0) {
    return [`'${group.join(`' or '`)}'${quantifiers}`, index];
  } else {
    return [quantifiers, index];
  }
}

module.exports = handleGroup;
