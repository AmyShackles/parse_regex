const handleQuantifiers = require("./quantifiers.js");

function handleGroup(regex, startingIndex) {
  let group = [];
  let i = startingIndex;
  while (regex[i] !== "]") {
    group.push(regex[i]);
    i++;
  }
  let quantifiers = handleQuantifiers(regex, i + 1);
  if (quantifiers.startsWith("Invalid")) {
    return quantifiers;
  }
  return `'${group.join(`' or '`)}'${quantifiers}`;
}

module.exports = handleGroup;
