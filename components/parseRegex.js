const handleGroup = require("./groups.js");
const { anchors } = require("./anchors.js");
const { handlePositiveLooks, handleNegativeLooks } = require("./looks.js");
const InvalidRegularExpression = require("./InvalidRegularExpression.js");
const { initialize, getFlags } = require("./setup.js");
const { parseBackslash } = require("./backSlash.js");
const { handleQuantifiers } = require("./quantifiers.js");
const parseHexadecimals = require("./hexadecimals.js");
const { parseUnicode } = require("./unicode.js");

function parseRegex(regex) {
  let { regexString, flags = [] } = initialize(regex);
  let ending = anchors(regexString);
  if (ending instanceof InvalidRegularExpression) {
    return `${ending.name}: ${ending.message}`;
  } else if (ending === "to the end of the line") {
    regexString = regexString.slice(0, -1);
  } else if (ending === "to the start of the line") {
    regexString = regexString.slice(1);
  } else if (ending === "to the start and end of the line") {
    regexString = regexString.slice(1, -1);
  }
  let returnString = {
    start: "Match",
    middle: "",
    end: ending ? ` ${ending}` : "",
  };
  let i = 0;
  let middle = [];

  while (i < regexString.length) {
    let currentPhrase = [];
    let prevPhrase = middle.length > 0 ? middle : regexString.slice(0, i);
    switch (regexString[i]) {
      case "[":
        let [group, index] = handleGroup(regexString, i + 1);
        if (group.startsWith("Invalid")) {
          return group;
        }
        // We only want to start searching after i
        i = index;
        currentPhrase.push(group);
        break;
      case "(":
        if (regexString[i + 1] === "?") {
          if (regexString[i + 2] === "<") {
            let endOfLookBehind = regexString.indexOf(")") + 1;
            let nextPhrase = parseRegex(
              `/${regexString.slice(endOfLookBehind)}/`
            );
            if (nextPhrase === "Match ") {
              nextPhrase = "";
            } else {
              nextPhrase = nextPhrase.slice(6);
            }
            let [look, index] = handleNegativeLooks(
              regexString,
              i + 3,
              nextPhrase
            );
            if (look instanceof InvalidRegularExpression) {
              return `${look.name}: ${look.message}`;
            }
            return `${returnString.start}${look}`;
          } else {
            // If we are dealing with lookbehinds or lookaheads
            // we will be replacing the contents of the middle array in the handleLooks function

            let [look, index] = handlePositiveLooks(
              regexString,
              i + 2,
              prevPhrase
            );
            // We want to search for the index of the closing character after i
            middle = [look];
            i = index;
          }
        }
        break;
      case "{":
        let [quantifiers, indexAfterRange] = handleQuantifiers(regexString, i);
        if (quantifiers instanceof InvalidRegularExpression) {
          return `${quantifiers.name}: ${quantifiers.message}`;
        } else if (indexAfterRange === i) {
          middle.push(`'${regexString[i]}'`);
        } else {
          i = indexAfterRange;
          middle[middle.length - 1] = `"${prevPhrase}${quantifiers}"`;
        }
        break;
      case "\\":
        const charAfterEscape = parseBackslash(regexString[++i]);
        if (charAfterEscape !== undefined) {
          currentPhrase.push(charAfterEscape);
        } else if (regexString[i] === "x") {
          let escaped = regexString.slice(i + 1, i + 3);
          let parsedHex = parseHexadecimals(escaped);
          if (parsedHex) {
            currentPhrase.push(parsedHex);
            i += 3;
          } else {
            currentPhrase.push(`'\\' followed by '${regexString[i]}'`);
          }
        } else if (regexString[i] === "u") {
          let [unicode, index] = parseUnicode(
            regexString,
            i,
            flags ? flags.includes("u") : false
          );
          if (i === index) {
            middle.push(unicode);
          } else {
            middle.push(unicode);
            i = index;
          }
        }
        break;
      case "*":
        prevPhrase =
          prevPhrase.length > 0 ? prevPhrase[prevPhrase.length - 1] : "";
        middle[middle.length - 1] = `"${prevPhrase} zero or more times"`;
        break;
      case "+":
        prevPhrase =
          prevPhrase.length > 0 ? prevPhrase[prevPhrase.length - 1] : "";
        middle[middle.length - 1] = `"${prevPhrase} one or more times"`;
        break;
      case "?":
        prevPhrase =
          prevPhrase.length > 0 ? prevPhrase[prevPhrase.length - 1] : "";
        middle[middle.length - 1] = `"${prevPhrase} zero or one time"`;
        break;
      case ".":
        if (flags && flags.includes("s")) {
          currentPhrase.push("'any character'");
        } else {
          currentPhrase.push("'any character except line breaks'");
        }
        break;
      default:
        currentPhrase.push(`'${regexString[i]}'`);
        break;
    }
    if (currentPhrase.length > 0) {
      middle.push(currentPhrase.join(""));
    }
    i++;
  }
  returnString.middle = middle
    ? middle.length > 1
      ? middle.join(" followed by ")
      : middle
    : "";
  return `${returnString.start} ${returnString.middle}${returnString.end}`;
}

module.exports = { parseRegex };
