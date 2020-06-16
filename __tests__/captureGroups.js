const { extractCaptures } = require("../src/components/captureGroups");

describe("extractCaptures", () => {
  it("should add capture groups to a regular expression object", () => {
    expect(extractCaptures("this expression has one (capture group) ")).toEqual(
      {
        "24": {
          "capture group": {
            startingIndex: 24,
            endingIndex: 39,
            group: "capture group",
          },
        },
      }
    );
  });
});
