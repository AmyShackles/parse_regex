const handleGroup = require("./groups.js");
const anchors = require("./anchors.js");
const handleLooks = require("./looks.js");
const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function initialize(regex) {
  if (!(regex instanceof RegExp)) {
    if (regex[0] === "/" && regex[regex.length - 1] === "/") {
      return regex.split("").slice(1, -1);
    } else if (regex[0] === "/") {
      return regex.split("").slice(1);
    } else if (regex[regex.length - 1] === "/") {
      return regex.split("").slice(0, -1);
    } else {
      return regex.split("");
    }
  } else {
    return regex.toString().split("").slice(1, -1);
  }
}
function parseRegex(regex) {
  let regexArray = initialize(regex);
  let ending = anchors(regexArray);
  if (ending instanceof InvalidRegularExpression) {
    return `${ending.name}: ${ending.message}`;
  }
  let returnString = {
    start: "Match",
    middle: "",
    end: ending || "",
  };
  let i = 0;
  let middle = [];
  while (i < regexArray.length) {
    let currentPhrase = [];
    switch (regexArray[i]) {
      case "[":
        let [group, index] = handleGroup(regexArray, i + 1);
        // console.log("regexArray[i] in switch", regexArray[i]);
        if (group.startsWith("Invalid")) {
          return group;
        }
        // We only want to start searching after i
        i = index;
        currentPhrase.push(group);
        break;
      case "(":
        // console.log('regexArray[i] === "("', regexArray[i], "i", i);
        if (regexArray[i + 1] === "?") {
          // console.log("middle", middle);
          const prevPhrase = middle ? middle : regexArray.slice(0, i);
          // If we are dealing with lookbehinds or lookaheads
          // we will be replacing the contents of the middle array in the handleLooks function
          middle = [];
          let look = handleLooks(regexArray, i + 2, prevPhrase);
          if (look.startsWith("Invalid")) {
            return look;
          }
          // We want to search for the index of the closing character after i
          currentPhrase.push(look);
        }
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

console.log(parseRegex("/[72]{2,5}[a-z](?<=52)[A-Z]/"));
