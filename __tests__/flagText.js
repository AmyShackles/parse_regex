const { getFlagText } = require("../src/components/flagText.js");

describe("getflagText", () => {
  it("should return an empty string if there are no flags", () => {
    expect(getFlagText(null)).toEqual("");
    expect(getFlagText("")).toEqual("");
    expect(getFlagText([])).toEqual("");
  });
  it("should return a description of the flag if there is one flag", () => {
    expect(getFlagText("g")).toEqual(" using global search");
    expect(getFlagText("i")).toEqual(" using case-insensitive search");
    expect(getFlagText("s")).toEqual(
      " using dotall (allowing '.' to match newlines) search"
    );
    expect(getFlagText("y")).toEqual(" using sticky search");
    expect(getFlagText("m")).toEqual(" using multiline search");
    expect(getFlagText("u")).toEqual(" using unicode search");
  });
  it("should return descriptions of flags separated by ' and ' if there are two", () => {
    expect(getFlagText("gi")).toEqual(
      " using global and case-insensitive search"
    );
    expect(getFlagText("is")).toEqual(
      " using case-insensitive and dotall (allowing '.' to match newlines) search"
    );
    expect(getFlagText("gm")).toEqual(" using global and multiline search");
  });
  it("should return descriptions using Oxford comma if more than two", () => {
    expect(getFlagText("gis")).toEqual(
      " using global, case-insensitive, and dotall (allowing '.' to match newlines) search"
    );
    expect(getFlagText("gum")).toEqual(
      " using global, unicode, and multiline search"
    );
  });
});
