const { initialize, getFlags } = require("../setup.js");

describe("initialize", () => {
  test("should handle if input is a string", () => {
    expect(initialize("/[abc]/")).toEqual({
      regexArray: ["[", "a", "b", "c", "]"],
      flags: null,
    });
  });
  test("should handle if input is a RegExp without flags", () => {
    expect(initialize(/[abc]/)).toEqual({
      regexArray: ["[", "a", "b", "c", "]"],
      flags: null,
    });
  });
  test("should handle if input is a RegExp with flags", () => {
    expect(initialize(/[abc]/gim)).toEqual({
      regexArray: ["[", "a", "b", "c", "]"],
      flags: "gim",
    });
  });
});
describe("getFlags", () => {
  test("should handle if regular expression has flags", () => {
    expect(getFlags("/[abc]/gim")).toEqual({
      regexArray: ["[", "a", "b", "c", "]"],
      flags: "gim",
    });
  });
  test("should handle if regular expression does not have flags", () => {
    expect(getFlags("/[abc]/")).toEqual({
      regexArray: ["[", "a", "b", "c", "]"],
      flags: null,
    });
  });
});
