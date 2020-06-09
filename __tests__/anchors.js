const {
  anchors,
  areAnchorsValid,
  removeEscapedIndices,
  isItEscaped,
  areAnchorsInCharacterSet,
  indexesOf,
} = require("../components/anchors.js");
const InvalidRegularExpression = require("../components/InvalidRegularExpression");

describe("anchors", () => {
  describe("anchors", () => {
    test("should return `to the start and end of the string` if regular expression starts with ^ and ends with $", () => {
      expect(anchors("^something$")[0]).toEqual(
        `to the start and end of the string`
      );
    });
    test("should return `to the start and end of the line` if regular expression starts with ^, ends with $, and has multiline flag set", () => {
      expect(anchors("^something$", "m")[0]).toEqual(
        `to the start and end of the line`
      );
    });
    test("should return `to the end of the string` if regular expression ends with $", () => {
      expect(anchors("something$")[0]).toEqual(`to the end of the string`);
    });
    test("should return  `to the end of the line` if regular expression ends with $ and multiline flag set", () => {
      expect(anchors("something$", "m")[0]).toEqual(`to the end of the line`);
    });
    test("should return `to the start of the string` if regular expression starts with ^", () => {
      expect(anchors("^something")[0]).toEqual(`to the start of the string`);
    });
    test("should return `to the start of the line` if regular expression starts with ^ and multiline flag set", () => {
      expect(anchors("^something", "m")[0]).toEqual(`to the start of the line`);
    });
    test("should not error out if an excluded set is included", () => {
      expect(anchors(/[^123]/.toString())[0]).not.toBeInstanceOf(
        InvalidRegularExpression
      );
    });
    describe("error handling", () => {
      test("should return an InvalidRegularExpression if the regular expression starts with a $", () => {
        expect(anchors("$amazing")[0]).toBeInstanceOf(InvalidRegularExpression);
        const [error] = anchors("$ama$ing$");
        expect(error).toBeInstanceOf(InvalidRegularExpression);
        expect(error.message).toBe(
          "Regular expressions cannot start with an end of string anchor ($). The $ is a special character in regular expressions.  You either need to include it at the very end of the regular expression, inside of a character set (e.g., [$]), or escape it (e.g., \\$)."
        );
      });
      test("should return an InvalidRegularExpression if the regular expression ends with a ^", () => {
        expect(anchors("$amazing^")[0]).toBeInstanceOf(
          InvalidRegularExpression
        );
        const [error] = anchors("^^");
        expect(error).toBeInstanceOf(InvalidRegularExpression);
        expect(error.message).toBe(
          "The ^ is a special character in regular expressions.  You either need to include it at the very beginning of the regular expression, inside of a character set (e.g, [^]), or escape it, (e.g., \\^)."
        );
      });
      test("should return an InvalidRegularExpression if a ^ or $ appears in the regular expression outside of a character set without being escaped", () => {
        const [error] = anchors("^$a$");
        expect(error).toBeInstanceOf(InvalidRegularExpression);
        expect(error.message).toBe(
          "Regular expressions cannot start with an end of string anchor ($). The $ is a special character in regular expressions.  You either need to include it at the very end of the regular expression, inside of a character set (e.g., [$]), or escape it (e.g., \\$)."
        );
      });
      test("should return an InvalidRegularExpression if it starts with '$' and ends with '^'", () => {
        expect(anchors("$a^")[0]).toBeInstanceOf(InvalidRegularExpression);
      });
    });
  });
  describe("areAnchorsValid", () => {
    test("there should be an error message if $ is used at the start of a regular expression if it is not the only character", () => {
      expect(() => {
        areAnchorsValid("$a");
      }).toThrow(
        "Regular expressions cannot start with an end of string anchor ($)."
      );
    });
    test("there should be an error message if ^ is used at the end of a regular expression if it is not the only character", () => {
      expect(() => {
        areAnchorsValid("a^");
      }).toThrow(
        "Regular expressions cannot end with a start of string anchor (^)."
      );
    });
    test("there should be an error message if there are unescaped ^ symbols not at the start of regex that aren't in a character set", () => {
      expect(() => {
        areAnchorsValid("a^a");
      }).toThrow(
        "The ^ is a special character in regular expressions.  You either need to include it at the very beginning of the regular expression, inside of a character set (e.g, [^]), or escape it, (e.g., \\^)."
      );
    });
    test("there should be an error message if there are unescaped $ symbols not at the end of regex that are't in a character set", () => {
      expect(() => {
        areAnchorsValid("$$$");
      }).toThrow(
        "The $ is a special character in regular expressions.  You either need to include it at the very end of the regular expression, inside of a character set (e.g., [$]), or escape it (e.g., \\$)."
      );
    });
    test("there should be an error message if the number of unescaped [ is not the same as the number of unescaped ]", () => {
      expect(() => {
        areAnchorsValid("[something]]");
      }).toThrow(
        'The number of unescaped opening square brackets "[" is not equal to the number of unescaped closing square brackets "]", which makes this regular expression invalid.'
      );
    });
    test("should return true if anchors are valid", () => {
      expect(areAnchorsValid("abc")).toBe(true);
      expect(areAnchorsValid("[abc]")).toBe(true);
    });
  });
  describe("isItEscaped", () => {
    test("should return true if the element at a given index is escaped", () => {
      expect(isItEscaped("\\^", 1)).toBe(true);
    });
    test("should return false if the element at a given index is not escaped", () => {
      expect(isItEscaped("723^", 3)).toBe(false);
    });
  });

  test("removeEscapedIndices should return an array of indices that are not escaped", () => {
    const regex = "\\^1234\\$$3$";
    const indices = [7, 8, 10];
    expect(removeEscapedIndices(regex, indices)).toEqual([8, 10]);
  });
  describe("areAnchorsInCharacterSet", () => {
    test("it should return true if anchor indices are found within character sets", () => {
      let anchorIndices = [3, 4, 8];
      let characterSetStarts = [0, 7];
      let characterSetEnds = [5, 9];
      expect(
        areAnchorsInCharacterSet(
          anchorIndices,
          characterSetStarts,
          characterSetEnds
        )
      ).toBe(true);
    });
    test("it should return false if anchor indices are not all found within character sets", () => {
      let anchorIndices = [2, 4, 6, 8];
      let characterSetStarts = [3, 7];
      let characterSetEnds = [5, 10];
      expect(
        areAnchorsInCharacterSet(
          anchorIndices,
          characterSetStarts,
          characterSetEnds
        )
      ).toBe(false);
    });
  });
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
