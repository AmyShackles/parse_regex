const { handleQuantifiers } = require("../src/components/quantifiers.js");
const InvalidRegularExpression = require("../src/components/InvalidRegularExpression");

describe("handleQuantifiers", () => {
  test('handles "*" quantifier', () => {
    expect(handleQuantifiers("a*", 1)).toEqual([" zero or more times", 1]);
  });
  test('handles "+" quantifier', () => {
    expect(handleQuantifiers("a+", 1)).toEqual([" one or more times", 1]);
  });
  test('handles "?" quantifier', () => {
    expect(handleQuantifiers("a?", 1)).toEqual([" zero or one time", 1]);
  });
  test("should return an InvalidRegularExpression if the first value in a quantifier range is higher than the second", () => {
    expect(handleQuantifiers("{5,2}", 0)[0]).toBeInstanceOf(
      InvalidRegularExpression
    );
  });
  test("should handle if a curly brace is passed but is not followed by a number", () => {
    expect(handleQuantifiers("{a}", 0)).toEqual(["", 0]);
  });
  test("should handle if a quantifier range has one digit", () => {
    expect(handleQuantifiers("{5}", 0)).toEqual([` five times`, 2]);
  });
  test("should handle if a quantifier range has a lower range only", () => {
    expect(handleQuantifiers("{5,}", 0)).toEqual([" at least five times", 3]);
    expect(handleQuantifiers("{15,}", 0)).toEqual([" at least 15 times", 4]);
  });
  test("should handle if a quantifier range has a lower and higher range", () => {
    expect(handleQuantifiers("{2,5}", 0)).toEqual([
      " between two and five times",
      4,
    ]);
    expect(handleQuantifiers("{10,12}", 0)).toEqual([
      " between 10 and 12 times",
      6,
    ]);
  });
});
