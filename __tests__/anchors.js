const {
  anchors,
  areAnchorsValid,
  removeEscapedIndices,
  isItEscaped,
  checkValidity,
  indexesOf,
} = require("../anchors.js");

test.todo(
  "anchors should return an InvalidRegularExpression if the regular expression starts with a $"
);
test.todo(
  "anchors should return an InvalidRegularExpression if the regular expression endds with a ^"
);
test.todo(
  "anchors should return an InvalidRegularExpression if a ^ or $ appears in the regular expression outside of a character set without being escaped"
);
