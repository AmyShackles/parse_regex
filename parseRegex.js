const handleGroup = require("./groups.js");
const anchors = require("./anchors.js");
const handleLooks = require("./looks.js");

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
  let returnString = {
    start: "Match",
    middle: "",
    end: anchors(regexArray) || "",
  };
  let i = 0;
  let middle = [];
  while (i < regexArray.length) {
    let currentPhrase = [];
    switch (regexArray[i]) {
      case "[":
        let group = handleGroup(regexArray, i + 1);
        if (group.startsWith("Invalid")) {
          return group;
        }
        currentPhrase.push(group);
      case "(":
        if (regexArray[i + 1] === "?") {
          console.log("middle", middle);
          const prevPhrase = middle ? middle : regexArray.slice(0, i);
          // If we are dealing with lookbehinds or lookaheads
          // we will be replacing the contents of the middle array in the handleLooks function
          middle = [];
          currentPhrase.push(handleLooks(regexArray, i + 2, prevPhrase));
        }
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

console.log(parseRegex("/[72]{3,2}/"));
