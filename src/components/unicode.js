function parseUnicode(regexString, index, bracePossible) {
  let hex;
  let codepoint;
  let unicode;
  // The \u{hhhh} format is only valid when the unicode flag is set
  // Else, it is parsed as literal
  if (bracePossible && regexString[index + 1] === "{") {
    hex = regexString.slice(index + 2, index + 6);
    if (regexString.length < index + 6 || isNaN(hex)) {
      return [regexString[index], index];
    } else {
      codepoint = parseInt(hex, 16);
      unicode = getUnicode(codepoint);
      if (unicode.length > 0) {
        return [`'${unicode}'`, index + 6];
      }
    }
  } else {
    if (
      regexString.length < index + 5 ||
      isNaN(regexString.slice(index + 1, index + 5))
    ) {
      return [`'${regexString[index]}'`, index];
    } else {
      let hex = regexString.slice(index + 1, index + 5);
      let codepoint = parseInt(hex, 16);
      unicode = getUnicode(codepoint);
      if (unicode.length > 0) {
        return [`'${unicode}'`, (index += 4)];
      }
    }
  }
}

function getUnicode(codepoint) {
  try {
    let regex = String.fromCodePoint(codepoint);
    return regex;
  } catch (err) {
    return codepoint;
  }
}

module.exports = { parseUnicode, getUnicode };
