const InvalidRegularExpression = require("./InvalidRegularExpression");

function initialize(regex) {
  let regexString;
  if (typeof regex === "string") {
    regexString = regex.slice(0, -1);
    if (regexString[0] !== "/" && regexString[regexString.length - 1] !== "/") {
      regexString = `/${regexString}/`;
    }
  } else {
    regexString = regex.toString();
  }

  function splitRegex(regexString) {
    return [
      ...regexString.matchAll(
        /(?:\/)(?<match>.*?)(?:\/)(?<flags>[gismyu]{0,6})/g
      ),
    ].map((reg) => {
      return { match: reg.groups.match || "", flags: reg.groups.flags || "" };
    })[0];
  }

  let regularExpression;
  try {
    const { match, flags } = splitRegex(regexString);
    regularExpression = new RegExp(match, flags);
    return { regexString: match, flags };
  } catch (error) {
    return { regexString: new InvalidRegularExpression(error), flags: "" };
  }
}

module.exports = { initialize };
