const groups = require("../groups.js");

describe("handleGroups", () => {
  test("handleGroups should return an array containing a string with members of a character set separated by 'or's and an index", () => {
    expect(groups(["1", "2", "3", "]"], 0)).toEqual(["'1' or '2' or '3'", 3]);
  });
  test("if there is a quantifier range, should return a string description of that range", () => {
    expect(groups(["]", "{", 3, ",", 5, "}"], 0)).toEqual([
      ` between 3 and 5 times`,
      5,
    ]);
  });
});
