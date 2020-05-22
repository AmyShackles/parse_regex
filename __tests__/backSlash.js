const { backSlash, parseBackslash } = require("../components/backSlash.js");

describe("backSlash", () => {
  describe("parseBacklash", () => {
    test("should return valid character class meanings", () => {
      expect(parseBackslash("w")).toEqual(
        "'any letter between a and z or any letter between A and Z or any digit between 0 and 9 or an underscore'"
      );
    });
    test("should return valid escape meanings", () => {
      expect(parseBackslash(".")).toEqual("the '.' symbol");
    });
    test("should return undefined if there isn't a special case", () => {
      expect(parseBackslash("c")).toEqual(undefined);
    });
  });
});
