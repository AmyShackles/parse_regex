const {
  anchors,
  areAnchorsValid,
  removeEscapedIndices,
  isItEscaped,
  areAnchorsInCharacterSet,
  indexesOf,
} = require("../anchors.js");
const InvalidRegularExpression = require("../InvalidRegularExpression");

describe("anchors", () => {
  describe("anchors", () => {
    test.todo(
      "anchors should return an InvalidRegularExpression if the regular expression starts with a $"
    );
    test.todo(
      "anchors should return an InvalidRegularExpression if the regular expression endds with a ^"
    );
    test.todo(
      "anchors should return an InvalidRegularExpression if a ^ or $ appears in the regular expression outside of a character set without being escaped"
    );
  });
  describe("areAnchorsValid", () => {
    test.todo(
      "there should be an error message if $ is used at the start of a regular expression if it is not the only character"
    );
    test.todo(
      "there should be an error message if ^ is used at the end of a regular expression if it is not the only character"
    );
    test.todo(
      "there should be an error message if there are unescaped ^ symbols not at the start of regex that aren't in a character set"
    );
    test.todo(
      "there should be an error message if there are unescaped $ symbols not at the end of regex that are't in a character set"
    );
    test.todo(
      "there should be an error message if the number of unescaped [ is not the same as the number of unescaped ]"
    );
  });
  describe("isItEscaped", () => {
    test.todo(
      "isItEscaped should return true if the element at a given index is escaped"
    );
    test.todo(
      "isItEscaped should return false if the element at a given index is not escaped"
    );
  });

  test.todo(
    "removeEscapedIndices should return an array of indices that are not escaped"
  );
  describe("indexesOf", () => {
    test("indexesOf should return an object with every tested regex as a key and the indices of all instances of that regex as the value", () => {
      let searchString = "eye of the tiger";
      let regex = /e|o|t/g;
      const { e, o, t } = indexesOf(searchString, regex);
      expect(e).toEqual([0, 2, 9, 14]);
      expect(o).toEqual([4]);
      expect(t).toEqual([7, 11]);
    });
    test("indexOf should return an object with undefined as value if regex not found", () => {
      let searchString = "eye of the tiger";
      let regex = /z/g;
      const { z } = indexesOf(searchString, regex);
      expect(z).toEqual(undefined);
    });
  });
});
