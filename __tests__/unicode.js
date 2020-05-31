const { parseUnicode, getUnicode } = require("../components/unicode.js");

describe("unicode parsing", () => {
  describe("getUnicode", () => {
    test("returns a valid value based on codepoint", () => {
      expect(getUnicode(65)).toEqual("A");
    });
  });
  describe("parseUnicode", () => {
    test("it should handle valid unicode values", () => {
      let regex = "[a-b]\\u0041";
      let index = 6;
      expect(parseUnicode(regex, index, false)).toEqual([
        "'A'",
        regex.length - 1,
      ]);
    });
    test("it should handle invalid unicode values", () => {
      let regex = "\\u2";
      let index = 1;
      expect(parseUnicode(regex, index, false)).toEqual(["'u'", index]);
    });
  });
});
