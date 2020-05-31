const groups = require("../components/groups.js");

describe("handleGroups", () => {
  test("should handle positive character sets", () => {
    expect(groups(["1", "2", "3", "]"], 0)).toEqual(["'1' or '2' or '3'", 3]);
  });
  test("should handle negated character sets", () => {
    expect(groups(["^", "1", "2", "3", "]"], 0)).toEqual([
      `'not any of "1 or 2 or 3"'`,
      4,
    ]);
  });
  test("if there is a quantifier range, should return a string description of that range", () => {
    expect(groups(["]", "{", 3, ",", 5, "}"], 0)).toEqual([
      ` between three and five times`,
      5,
    ]);
  });
});
