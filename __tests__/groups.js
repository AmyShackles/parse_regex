const groups = require("../components/groups.js");

describe("handleGroups", () => {
  test("should handle positive character sets", () => {
    expect(groups(["1", "2", "3", "]"], 0)).toEqual(["'1' or '2' or '3'", 3]);
  });
  test("should handle negated character sets", () => {
    expect(groups(["^", "1", "2", "3", "]"], 0)).toEqual([
      `"not any of '1' or '2' or '3'"`,
      4,
    ]);
  });
  it("should return a string description of that range if there is a quantifier range", () => {
    expect(groups(["]", "{", 3, ",", 5, "}"], 0)).toEqual([
      ` between three and five times`,
      5,
    ]);
    expect(groups(["^", "1", "2", "3", "]", "{", 3, ",", "}"], 0)).toEqual([
      `'"not any of '1' or '2' or '3'" at least three times'`,
      8,
    ]);
  });
  test("it should handle escaped characters in character set", () => {
    expect(groups(["\\", ".", "]"], 0)).toEqual(["'the '.' symbol'", 2]);
  });
  test("it should handle if a range is invalid", () => {
    expect(groups(["a", "-", ".", "]"], 0)).toEqual(["'a' or '-' or '.'", 3]);
  });
});
