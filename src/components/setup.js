const InvalidRegularExpression = require("./InvalidRegularExpression");

function initialize(regex) {
  const regexString = typeof regex === "string" ? regex : regex.toString();
  function splitRegex(regexString) {
    return [
      ...regexString.matchAll(
        /(?:\/)(?<match>.*?)(?:\/)(?<flags>[gismyu]{0,6})/g
      ),
    ].map((reg) => {
      return { match: reg.groups.match || "", flags: reg.groups.flags || "" };
    });
  }

  let regularExpression;
  try {
    const { match, flags } = splitRegex(regexString)[0];
    regularExpression = new RegExp(match, flags);
    return { regexString: match, flags };
  } catch (error) {
    return { regexString: new InvalidRegularExpression(error), flags: "" };
  }
}

module.exports = { initialize };
