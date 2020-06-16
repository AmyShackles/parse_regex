const { initialize, getFlags } = require("../src/components/setup.js");
const InvalidRegularExpression = require("../src/components/InvalidRegularExpression.js");

describe("initialize", () => {
  test("should handle if input is a string", () => {
    expect(initialize("/[abc]/")).toEqual({
      regexString: "[abc]",
      flags: "",
    });
    expect(initialize("/[abc]/u")).toEqual({
      regexString: "[abc]",
      flags: "u",
    });
    expect(initialize("/[abc]/g")).toEqual({
      regexString: "[abc]",
      flags: "g",
    });
  });
  test("should handle if input is a RegExp without flags", () => {
    expect(initialize(/[abc]/)).toEqual({
      regexString: "[abc]",
      flags: "",
    });
  });
  test("should handle if input is a RegExp with flags", () => {
    expect(initialize(/[abc]/gim)).toEqual({
      regexString: "[abc]",
      flags: "gim",
    });
  });
  test("should return a syntax error if regular expression is invalid", () => {
    expect(() => {
      initialize(/[ab]{6,3}/);
    }).toThrow(
      "Invalid regular expression: /[ab]{6,3}/: numbers out of order in {} quantifier"
    );
  });
});
