const {
  handlePositiveLooks,
  handleNegativeLooks,
} = require("../src/components/looks.js");

describe("looks", () => {
  it("should handle lookaheads", () => {
    expect(handlePositiveLooks("abc(?!2)", 5, ["'a'", "'b'", "'c'"])).toEqual([
      "\"'a' followed by 'b' followed by 'c'\" only if \"'a' followed by 'b' followed by 'c'\" is not followed by \"2\"",
      8,
    ]);
    expect(handlePositiveLooks("abc(?=2)", 5, ["'a'", "'b'", "'c'"])).toEqual([
      "\"'a' followed by 'b' followed by 'c'\" only if \"'a' followed by 'b' followed by 'c'\" is followed by \"2\"",
      8,
    ]);
  });
  it("should handle lookbehinds", () => {
    expect(
      handleNegativeLooks(
        "(?<=not) good",
        3,
        "' ' followed by 'g' followed by 'o' followed by 'o' followed by 'd'"
      )
    ).toEqual([
      " \"' ' followed by 'g' followed by 'o' followed by 'o' followed by 'd'\" only if \"' ' followed by 'g' followed by 'o' followed by 'o' followed by 'd'\" follows \"'n' followed by 'o' followed by 't'\"",
      8,
    ]);
    expect(
      handleNegativeLooks(
        "(?<!not)good",
        3,
        "'g' followed by 'o' followed by 'o' followed by 'd'"
      )
    ).toEqual([
      " \"'g' followed by 'o' followed by 'o' followed by 'd'\" only if \"'g' followed by 'o' followed by 'o' followed by 'd'\" does not follow \"'n' followed by 'o' followed by 't'\"",
      8,
    ]);
  });
});
