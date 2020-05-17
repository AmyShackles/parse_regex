const handleQuantifiers = require("../quantifiers.js");

test('handles "*" quantifier', () => {
  expect(handleQuantifiers("a*", 1)).toEqual([" zero or more times", 1]);
});
test('handles "+" quantifier', () => {
  expect(handlesQuantifiers("a+", 1)).toEqual([" one or more times", 1]);
});
test('handles "?" quantifier', () => {
  expect(handlesQuantifiers("a?", 1)).toEqual([" zero or one time", 1]);
});
