const {
  anchors,
  areAnchorsValid,
  removeEscapedIndices,
  isItEscaped,
  areAnchorsInCharacterSet,
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
test.todo(
  "isItEscaped should return true if the element at a given index is escaped"
);
test.todo(
  "isItEscaped should return false if the element at a given index is not escaped"
);
test.todo(
  "removeEscapedIndices should return an array of indices that are not escaped"
);
test.todo(
  "indexesOf should return the indices of all instances of a given string"
);
