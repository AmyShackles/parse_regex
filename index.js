const handleGroup = require("./groups.js");
const { anchors } = require("./anchors.js");
const handleLooks = require("./looks.js");
const InvalidRegularExpression = require("./InvalidRegularExpression.js");
const { initialize, getFlags } = require("./setup.js");

function parseRegex(regex) {
  let { regexString, flags } = initialize(regex);
  console.log("flags", flags);
  let ending = anchors(regexString);
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
  while (i < regexString.length) {
    let currentPhrase = [];
    switch (regexString[i]) {
      case "[":
        let [group, index] = handleGroup(regexString, i + 1);
        // console.log("regexStringy[i] in switch", regexString[i]);
        if (group.startsWith("Invalid")) {
          return group;
        }
        // We only want to start searching after i
        i = index;
        currentPhrase.push(group);
        break;
      case "(":
        // console.log('regexString[i] === "("', regexString[i], "i", i);
        if (regexString[i + 1] === "?") {
          // console.log("middle", middle);
          const prevPhrase = middle ? middle : regexString.slice(0, i);
          // If we are dealing with lookbehinds or lookaheads
          // we will be replacing the contents of the middle array in the handleLooks function
          middle = [];
          let look = handleLooks(regexString, i + 2, prevPhrase);
          if (look instanceof InvalidRegularExpression) {
            return `${look.name}: ${look.message}`;
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

console.log(parseRegex(/[123]{2,3}/gim));
