const handleGroup = require("./groups.js");
const { anchors } = require("./anchors.js");
const { handlePositiveLooks, handleNegativeLooks } = require("./looks.js");
const InvalidRegularExpression = require("./InvalidRegularExpression.js");
const { initialize } = require("./setup.js");
const { parseBackslash } = require("./backSlash.js");
const { handleQuantifiers } = require("./quantifiers.js");
const { parseUnicode } = require("./unicode.js");
const { getFlagText } = require("./flagText.js");
const { extractCaptures } = require("./captureGroups.js");

function parseRegex(regex) {
  let { regexString, flags = "" } = initialize(regex);
  if (regexString instanceof InvalidRegularExpression) {
    return `${regexString.message}`;
  }
  if (
    regexString instanceof Error ||
    regexString instanceof InvalidRegularExpression
  ) {
    return `${regexString.name}: ${regexString.messaage}`;
  }
  let [ending, string] = anchors(regexString, flags);
  if (ending instanceof InvalidRegularExpression) {
    return `${ending.name}: ${ending.message}`;
  } else {
    regexString = string;
  }
  const regularExpression = extractCaptures(regexString);
  regularExpression.start = "Match";
  regularExpression.middle = "";
  regularExpression.end = ending ? ` ${ending}` : "";
  regularExpression.flags = getFlagText(flags);
  regularExpression.captures = [""]; // Backreferences start at 1, not 0
  regularExpression.namedCaptures = {};
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
        if (regularExpression[i]) {
          let key = regularExpression[i]["capture group"]
            ? "capture group"
            : regularExpression[i]["non-capture group"]
            ? "non-capture group"
            : regularExpression[i]["named capture group"]
            ? "named capture group"
            : "";
          const endIndex = regularExpression[i][key].endingIndex - 1;
          let group = parseRegex(`/${regularExpression[i][key].group}/`);
          if (group === "Match ") {
            group = "";
          } else {
            group = group.slice(6);
          }
          if (key === "named capture group" || key === "capture group") {
            regularExpression["captures"].push(group);
          }
          if (key === "named capture group") {
            const name = regularExpression[i][key].name;
            if (regularExpression.namedCaptures[name] !== undefined) {
              regularExpression.namedCaptures[name].push(group);
            } else {
              regularExpression.namedCaptures[name] = [group];
            }
          }
          const description =
            key === "named capture group"
              ? `(creating a ${key} by the name of <${regularExpression[i][key].name}>)`
              : `(creating a ${key})`;
          middle.push(`"${group} ${description}"`);
          i = endIndex;
        }
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
            return `${regularExpression.start}${look}`;
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
          prevPhrase =
            prevPhrase.length > 0 ? prevPhrase[prevPhrase.length - 1] : "";
          middle[middle.length - 1] = `"${prevPhrase}${quantifiers}"`;
        }
        break;
      case "\\":
        const charAfterEscape = parseBackslash(regexString[++i]);
        let newIndex;
        if (charAfterEscape !== undefined) {
          currentPhrase.push(charAfterEscape);
        } else if (regexString[i] === "x") {
          const hex = regexString.slice(i + 1, i + 3);
          const codepoint = parseInt(hex, 16);
          const parsedHex = codepoint && String.fromCodePoint(codepoint);
          if (parsedHex) {
            currentPhrase.push(`'${parsedHex}'`);
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
        } else if (regexString[i] === "k") {
          if (regexString[i + 1] === "<") {
            const endOfName = regexString.indexOf(">", i + 2);
            const name = regexString.slice(i + 2, endOfName);
            middle.push(`"${regularExpression.namedCaptures[name]}"`);
            i = endOfName;
          } else {
            middle.push("'k' followed by '<'");
          }
        } else if (!isNaN(regexString[i])) {
          const capture = regularExpression.captures[regexString[i]];
          if (capture) {
            middle.push(`"${capture}"`);
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
        middle.push(`'${regexString[i]}'`);
        break;
    }
    if (currentPhrase.length > 0) {
      middle.push(currentPhrase.join(""));
    }
    i++;
  }
  regularExpression.middle = middle
    ? middle.length > 1
      ? middle.join(" followed by ")
      : middle
    : "";
  return `${regularExpression.start} ${regularExpression.middle}${regularExpression.end}${regularExpression.flags}`;
}

exports.parseRegex = parseRegex;
