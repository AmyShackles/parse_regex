function initialize(regex) {
  if (regex.constructor.name === "RegExp") {
    let regexString = regex.toString();
    return getFlags(regexString);
  } else if (regex.match(/\/.+\/[gimsuy]{0,6}/)) {
    const string = regex.match(/\/.+\/[gimsuy]{0,6}/)[0];
    return getFlags(string);
  } else if (regex.match(/RegExp\(.+\)/)) {
    const startIndex = regex.indexOf("RegExp");
    const lengthOfRegExp = "RegExp(".length + 1;
    const endIndex = regex.indexOf('"', startIndex + lengthOfRegExp);
    const string = regex.slice(startIndex + lengthOfRegExp, endIndex);
    if (regex.match(",")) {
      let flags = [];
      let flagIndex = regex.indexOf(",") + 1;
      let quotations = false;
      while (flagIndex < regex.length) {
        if (regex[flagIndex] === '"') {
          if (quotations) {
            break;
          } else {
            quotations = true;
          }
        } else if (regex[flagIndex] !== " ") {
          flags.push(regex[flagIndex]);
        }
        flagIndex++;
      }
      return getFlags(`/${string}/${flags.join("")}`);
    }
    return getFlags(string);
  }
  return getFlags(regex.trim());
}
function getFlags(regexString) {
  if (regexString[0] === "/") {
    if (regexString[regexString.length - 1] === "/") {
      return { regexString: regexString.slice(1, -1), flags: null };
    } else {
      const endOfPattern = regexString.lastIndexOf("/");
      const flags = regexString.slice(endOfPattern + 1);
      regexString = regexString.slice(1, endOfPattern);
      return { regexString, flags };
    }
  } else {
    return { regexString, flags: null };
  }
}

module.exports = { initialize, getFlags };
