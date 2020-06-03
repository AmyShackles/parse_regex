const { handleQuantifiers } = require("../components/quantifiers.js");
const InvalidRegularExpression = require("../components/InvalidRegularExpression");

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
  test("should handle if a quantifier range has one digit", () => {
    expect(handleQuantifiers("{5}", 0)).toEqual([` five times`, 2]);
  });
  test("should handle if a quantifier range has a lower range only", () => {
    expect(handleQuantifiers("{5,}", 0)).toEqual([" at least five times", 3]);
  });
  test("should handle if a quantifier range has a lower and higher range", () => {
    expect(handleQuantifiers("{2,5}", 0)).toEqual([
      " between two and five times",
      4,
    ]);
  });
});
