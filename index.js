const handleGroup = require("./components/groups.js");
const { anchors } = require("./components/anchors.js");
const handleLooks = require("./components/looks.js");
const InvalidRegularExpression = require("./components/InvalidRegularExpression.js");
const { initialize, getFlags } = require("./components/setup.js");
const { parseBackslash } = require("./components/backSlash.js");
const { handleRangeQuantifiers } = require("./components/quantifiers.js");
const parseHexadecimals = require("./components/hexadecimals.js");
const readline = require("readline");

function parseRegex(regex) {
  let { regexString, flags } = initialize(regex);
  let ending = anchors(regexString);
  if (ending instanceof InvalidRegularExpression) {
    return `${ending.name}: ${ending.message}`;
  } else if (ending === "to the end of the line") {
    regexString = regexString.slice(0, -1);
  } else if (ending === "to the start of the line") {
    regexString = regexString.slice(1);
  }
  let returnString = {
    start: "Match",
    middle: "",
    end: ending || "",
  };
  let i = 0;
  let middle = [];

  while (i < regexString.length) {
    let currentPhrase = [];
    let lastPhrase =
      middle.length > 0 && middle[middle.length - 1].slice(0, -1);
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
          const prevPhrase = middle ? middle : regexString.slice(0, i);
          // If we are dealing with lookbehinds or lookaheads
          // we will be replacing the contents of the middle array in the handleLooks function

          let look = handleLooks(regexString, i + 2, prevPhrase);
          if (look instanceof InvalidRegularExpression) {
            return `${look.name}: ${look.message}`;
          }
          // We want to search for the index of the closing character after i
          currentPhrase.push(look);
        }
        break;
      case "{":
        let [quantifiers, indexAfterRange] = handleRangeQuantifiers(
          regexString,
          i
        );
        if (quantifiers instanceof InvalidRegularExpression) {
          return `${quantifiers.name}: ${quantifiers.message}`;
        }
        i = indexAfterRange;
        currentPhrase.push(quantifiers);
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
            currentPhrase.push(regexString[i++]);
          }
          break;
        }

        break;
      case "*":
        middle[middle.length - 1] = lastPhrase += " zero or more times'";
        break;
      case "+":
        middle[middle.length - 1] = lastPhrase += " one or more times'";
        break;
      case "?":
        middle[middle.length - 1] = lastPhrase += " zero or one time'";
        break;
      default:
        currentPhrase.push(`'${regexString[i]}' `);
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
  return `${returnString.start} ${returnString.middle} ${returnString.end}`;
}

if (require.main == module) {
  if (process.argv.length >= 3) {
    // Take input from argument
    console.log(parseRegex(process.argv[2]));
  } else {
    // Interactive prompt
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: ">  ",
    });
    rl.prompt();

    rl.on("line", (line) => {
      switch (line.trim()) {
        case ".end":
          console.log("Have a nice day!");
          process.exit(0);
        case ".q":
          console.log("Have a nice day!");
          process.exit(0);
        case ".quit":
          console.log("Have a nice day!");
          process.exit(0);
        case ".exit":
          console.log("Have a nice day!");
          process.exit(0);
        default:
          console.log(parseRegex(line.trim()));
          break;
      }
      rl.prompt();
    }).on("close", () => {
      console.log("Have a nice day!");
      process.exit(0);
    });
  }
}

module.exports = parseRegex;
