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

let inLoop = false;
let inCapture = false;

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
  let currentCharacterIndex = 0;
  let middle = [];

  while (currentCharacterIndex < regexString.length) {
    let currentPhrase = [];
    let prevPhrase =
      middle.length > 0 ? middle : regexString.slice(0, currentCharacterIndex);
    switch (regexString[currentCharacterIndex]) {
      case "[":
        let [group, index] = handleGroup(
          regexString,
          currentCharacterIndex + 1
        );
        if (group.startsWith("Invalid")) {
          return group;
        }
        // We only want to start searching after currentCharacterIndex
        currentCharacterIndex = index;
        currentPhrase.push(group);
        break;
      case "(":
        if (regularExpression[currentCharacterIndex]) {
          let key = regularExpression[currentCharacterIndex]["capture group"]
            ? "capture group"
            : regularExpression[currentCharacterIndex]["non-capture group"]
            ? "non-capture group"
            : regularExpression[currentCharacterIndex]["named capture group"]
            ? "named capture group"
            : "";
          const endIndex =
            regularExpression[currentCharacterIndex][key].endingIndex - 1;
            inLoop = true;
          let group = parseRegex(
            `/${regularExpression[currentCharacterIndex][key].group}/`
          );
          inLoop = false;
          if (group === "Match ") {
            group = "";
          } else {
            group = group.slice(6);
          }
          if (key === "named capture group" || key === "capture group") {
            regularExpression["captures"].push(group);
          }
          if (key === "named capture group") {
            const name = regularExpression[currentCharacterIndex][key].name;
            if (regularExpression.namedCaptures[name] !== undefined) {
              regularExpression.namedCaptures[name].push(group);
            } else {
              regularExpression.namedCaptures[name] = [group];
            }
          }
          const description =
            key === "named capture group"
              ? `(creating a ${key} by the name of '${regularExpression[currentCharacterIndex][key].name}')`
              : `(creating a ${key})`;
          middle.push(`"${group}" ${description}`);
          currentCharacterIndex = endIndex;
        }
        if (regexString[currentCharacterIndex + 1] === "?") {
          if (regexString[currentCharacterIndex + 2] === "<") {
            let endOfLookBehind = regexString.indexOf(")") + 1;
            inLoop = true;
            let nextPhrase = parseRegex(
              `/${regexString.slice(endOfLookBehind)}/`
            );
            inLoop = false;
            if (nextPhrase === "Match ") {
              nextPhrase = "";
            } else {
              nextPhrase = nextPhrase.slice(6);
            }
            let [look, index] = handleNegativeLooks(
              regexString,
              currentCharacterIndex + 3,
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
              currentCharacterIndex + 2,
              prevPhrase
            );
            // We want to search for the index of the closing character after currentCharacterIndex
            middle = [look];
            currentCharacterIndex = index;
          }
        }
        break;
      case "{":
        let [quantifiers, indexAfterRange] = handleQuantifiers(
          regexString,
          currentCharacterIndex
        );
        if (quantifiers instanceof InvalidRegularExpression) {
          return `${quantifiers.name}: ${quantifiers.message}`;
        } else if (indexAfterRange === currentCharacterIndex) {
          middle.push(`'${regexString[currentCharacterIndex]}'`);
        } else {
          currentCharacterIndex = indexAfterRange;
          prevPhrase =
            prevPhrase.length > 0 ? prevPhrase[prevPhrase.length - 1] : "";
          middle[middle.length - 1] = `"${prevPhrase}${quantifiers}"`;
        }
        break;
      case "\\":
        const charAfterEscape = parseBackslash(
          regexString[++currentCharacterIndex]
        );
        let newIndex;
        if (charAfterEscape !== undefined) {
          currentPhrase.push(charAfterEscape);
        } else if (regexString[currentCharacterIndex] === "x") {
          const hex = regexString.slice(
            currentCharacterIndex + 1,
            currentCharacterIndex + 3
          );
          const codepoint = parseInt(hex, 16);
          const parsedHex = codepoint && String.fromCodePoint(codepoint);
          if (parsedHex) {
            currentPhrase.push(`'${parsedHex}'`);
            currentCharacterIndex += 3;
          } else {
            currentPhrase.push(
              `'\\' followed by '${regexString[currentCharacterIndex]}'`
            );
          }
        } else if (regexString[currentCharacterIndex] === "u") {
          let [unicode, index] = parseUnicode(
            regexString,
            currentCharacterIndex,
            flags ? flags.includes("u") : false
          );
          if (currentCharacterIndex === index) {
            middle.push(unicode);
          } else {
            middle.push(unicode);
            currentCharacterIndex = index;
          }
        } else if (regexString[currentCharacterIndex] === "k") {
          if (regexString[currentCharacterIndex + 1] === "<") {
            const endOfName = regexString.indexOf(
              ">",
              currentCharacterIndex + 2
            );
            const name = regexString.slice(
              currentCharacterIndex + 2,
              endOfName
            );
            if (regularExpression.namedCaptures[name] !== undefined) {
              middle.push(`the repeat of named capture group '${name}' containing "${regularExpression.namedCaptures[name]}"`);
            } else {

            }
            currentCharacterIndex = endOfName;
          } else {
            middle.push("'k' followed by '<'");
          }
        } else if (!isNaN(regexString[currentCharacterIndex])) {
          const capture =
            regularExpression.captures[regexString[currentCharacterIndex]];
          if (capture) {
            middle.push(`the repeat of capture group containing "${capture}"`);
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
        currentPhrase.push(`'${regexString[currentCharacterIndex]}'`);
        break;
    }
    if (currentPhrase.length > 0) {
      middle.push(currentPhrase.join());
    }
    currentCharacterIndex++;
  }
  if (middle && middle.length && inLoop) {
    middle = middle.map(string => string.replace(/'/g, ""));
    middle = middle.join("");
  } else if (middle && middle.length > 1) {
    middle = middle.join(" followed by ");
  }
  if (!middle) {
    middle = "";
  }
  regularExpression.middle = middle;
  return `${regularExpression.start} ${regularExpression.middle}${regularExpression.end}${regularExpression.flags}`;
}

exports.parseRegex = parseRegex;
