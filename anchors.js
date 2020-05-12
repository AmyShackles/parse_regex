function anchors(regex) {
  if (regex[regex.length - 1] === "$" && regex[0] === "^") {
    regex.shift();
    regex.pop();
    return `to the start and end of the line`;
  } else {
    if (regex[regex.length - 1] === "$") {
      regex.pop();
      return `to the end of the line`;
    }
    if (regex[0] === "^") {
      regex.shift();
      return `to the start of the line`;
    }
  }
}

module.exports = anchors;
