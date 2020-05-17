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
function splitByCapture(regex) {
  let split = [];
  let current = "";
  for (let i = 0; i < regex.length; i++) {
    let capture = [];
    if (regex[i] === "(") {
      if (current) split.push(current);
      current = "";
      while (regex[i] !== ")") {
        capture.push(regex[i++]);
      }
      capture.push(regex[i]);
      split.push(capture.join(""));
    } else if (regex[i] === "{") {
      let quant = [];
      if (current) split.push(current);
      current = "";
      while (regex[i] !== "}") {
        quant.push(regex[i++]);
      }
      quant.push(regex[i]);
      split.push(quant.join(""));
    } else {
      current += regex[i];
      console.log("current", current);
    }
  }
  split.push(current);
  return split;
}

function regexParser(regex) {
  let regEx = splitByCapture(initialize(regex));
  return { regex, regEx };
}

console.log(regexParser(/cat (somebody I used to know){3,5} something/));
