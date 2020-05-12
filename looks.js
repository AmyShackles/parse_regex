function handleLooks(regex, index, prevPhrase) {
  let currentPhrase = [];
  let nextPhrase;
  let i = index + 1;
  while (regex[i] !== ")" && i < regex.length) {
    currentPhrase.push(regex[i]);
    i++;
  }
  if (regex[index] === "<") {
    nextPhrase = regex.slice(i + 1);
  }
  currentPhrase = currentPhrase ? currentPhrase.join("") : "";
  nextPhrase = nextPhrase ? nextPhrase.join("") : "";
  prevPhrase = prevPhrase.join("");
  switch (regex[index]) {
    case "=": // positive lookahead
      return ` "${prevPhrase}" only if "${prevPhrase}" is followed by "${currentPhrase}"`;
    case "!": // negative lookahead
      return ` "${prevPhrase}" only if "${prevPhrase}" is not followed by "${currentPHrase}"`;
    case "<":
      if (regex[index + 1] === "=") {
        // positive lookbehind
        return ` "${nextPhrase}" only if "${nextPhrase}" follows "${currentPhrase}"`;
      } else if (regex[index + 1] === "!") {
        // negative lookbehind
        return ` "${nextPhrase}" only if "${nextPhrase}" does not follow "${currentPhrase}"`;
      }
    default:
      return "";
  }
}

module.exports = handleLooks;