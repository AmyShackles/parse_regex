const { initialize, getFlags } = require("../src/components/setup.js");

describe("initialize", () => {
  test("should handle if input is a string", () => {
    expect(initialize("/[abc]/")).toEqual({
      regexString: "[abc]",
      flags: "",
    });
    expect(initialize(new RegExp("[abc]"))).toEqual({
      regexString: "[abc]",
      flags: "",
    });
    expect(initialize(RegExp("[abc]", "g"))).toEqual({
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
});
