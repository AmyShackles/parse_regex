const parseHexadecimals = require("../components/hexadecimals");

describe("parseHexadecimals", () => {
  test("should handle hexadecimal values for capital letters", () => {
    expect(parseHexadecimals("41")).toEqual("'A'");
  });
  test("should handle hexadecimal values for lowercase letters", () => {
    expect(parseHexadecimals("72")).toEqual("'r'");
  });
  test("should handle hexadecimal values for punctuation", () => {
    expect(parseHexadecimals("21")).toEqual("'!'");
  });
  test("should return undefined if invalid hexadecimal character", () => {
    expect(parseHexadecimals("5")).toEqual(undefined);
  });
});
