const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function handlePositiveLooks(regex, index, prevPhrase) {
  let currentPhrase = [];
  let i = index + 1;
  while (regex[i] !== ")" && i < regex.length) {
    currentPhrase.push(regex[i]);
    i++;
  }
  currentPhrase = currentPhrase ? currentPhrase.join("") : "";
  prevPhrase =
    prevPhrase.length > 1
      ? prevPhrase.join(" followed by ")
      : prevPhrase.join("");
  if (regex[index] === "=") {
    // positive lookahead
    return [
      `"${prevPhrase}" only if "${prevPhrase}" is followed by "${currentPhrase}"`,
      i + 1,
    ];
  } else if (regex[index] === "!") {
    // negative lookahead
    return [
      `"${prevPhrase}" only if "${prevPhrase}" is not followed by "${currentPhrase}"`,
      i + 1,
    ];
  } else {
    return ["", index];
  }
}

function handleNegativeLooks(regex, index, nextPhrase) {
  let currentPhrase = [];
  let i = index + 1;
  while (regex[i] !== ")" && i < regex.length) {
    currentPhrase.push(`'${regex[i]}'`);
    i++;
  }
  if (nextPhrase.length < 1) {
    return [
      new InvalidRegularExpression(
        "You cannot use a lookbehind at the end of input"
      ),
      -1,
    ];
  }
  currentPhrase =
    currentPhrase.length > 1
      ? currentPhrase.join(" followed by ")
      : currentPhrase.join("");
  if (regex[index] === "=") {
    // positive lookbehind
    return [
      ` "${nextPhrase}" only if "${nextPhrase}" follows "${currentPhrase}"`,
      i + 1,
    ];
  } else if (regex[index] === "!") {
    // negative lookbehind
    return [
      ` "${nextPhrase}" only if "${nextPhrase}" does not follow "${currentPhrase}"`,
      i + 1,
    ];
  } else {
    return ["", index];
  }
}
module.exports = { handlePositiveLooks, handleNegativeLooks };
