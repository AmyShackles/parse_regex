const { parseRegex } = require("../src/components/parseRegex.js");
const InvalidRegularExpression = require("../src/components/InvalidRegularExpression.js");

describe("parseRegex", () => {
  describe("anchor handling", () => {
    describe("error handling", () => {
      it("should return an Invalid Regular Expression message if the $ anchor is at the beginning", () => {
        expect(parseRegex(/$ad/)).toEqual(
          "Invalid Regular Expression: Regular expressions cannot start with an end of string anchor ($). The $ is a special character in regular expressions.  You either need to include it at the very end of the regular expression, inside of a character set (e.g., [$]), or escape it (e.g., \\$)."
        );
      });
    });
    it("should work if there is a starting anchor", () => {
      expect(parseRegex(/^ab/)).toEqual(
        "Match 'a' followed by 'b' to the start of the string"
      );
    });
    it("should work if there is an ending anchor", () => {
      expect(parseRegex(/ab$/)).toEqual(
        "Match 'a' followed by 'b' to the end of the string"
      );
    });
    it("should work if there is a starting and ending anchor", () => {
      expect(parseRegex(/^ab$/)).toEqual(
        "Match 'a' followed by 'b' to the start and end of the string"
      );
    });
    it("should work if there is neither a starting or ending anchor", () => {
      expect(parseRegex(/ab/)).toEqual("Match 'a' followed by 'b'");
    });
  });
  describe("group handling", () => {
    describe("error handling", () => {
      it("should return an Invalid Regular Expression message if quantifiers in a group are invalid", () => {
        expect(parseRegex("/[ab]{6,3}/")).toEqual(
          "SyntaxError: Invalid regular expression: /[ab]{6,3}/: numbers out of order in {} quantifier"
        );
      });
    });
    it("should handle groups without quantifiers", () => {
      expect(parseRegex(/[a-d]/)).toEqual("Match \"any of 'a' through 'd'\"");
    });
    it("should handle groups with quantifiers", () => {
      expect(parseRegex(/[a-d]{13}/)).toEqual(
        "Match '\"any of 'a' through 'd'\" 13 times'"
      );
      expect(parseRegex(/[^123]{3,}/)).toEqual(
        "Match '\"not any of '1' or '2' or '3'\" at least three times'"
      );
    });
    it("should handle capture groups", () => {
      expect(parseRegex(/a(dog)/)).toEqual(
        "Match 'a' followed by \"dog\" (creating a capture group)"
      );
      expect(parseRegex(/^a(dog)$/m)).toEqual(
        "Match 'a' followed by \"dog\" (creating a capture group) to the start and end of the line using multiline search"
        );
    });
    it("should handle non-capture groups", () => {
      expect(parseRegex(/a(?:dog)/)).toEqual(
        "Match 'a' followed by \"dog\" (creating a non-capture group)"
      );
    });
    it("should handle named capture groups", () => {
      expect(parseRegex(/(?<test>testing)or something/)).toEqual(
        "Match \"testing\" (creating a named capture group by the name of 'test') followed by 'o' followed by 'r' followed by ' ' followed by 's' followed by 'o' followed by 'm' followed by 'e' followed by 't' followed by 'h' followed by 'i' followed by 'n' followed by 'g'"
      )
    });
  });
  describe("looks", () => {
    describe("error handling", () => {
      it("should return an Invalid Regular Expression message if a look is invalid", () => {
        expect(parseRegex(/a(?<=d)/)).toEqual(
          "Invalid Regular Expression: You cannot use a lookbehind at the end of input"
        );
        expect(parseRegex(/a(?<!d)/)).toEqual(
          "Invalid Regular Expression: You cannot use a lookbehind at the end of input"
        );
      });
    });
    it("should handle lookaheads", () => {
      expect(parseRegex(/abc(?=2)/)).toEqual(
        "Match \"'a' followed by 'b' followed by 'c'\" only if \"'a' followed by 'b' followed by 'c'\" is followed by \"2\""
      );
      expect(parseRegex(/abc(?!2)/)).toEqual(
        "Match \"'a' followed by 'b' followed by 'c'\" only if \"'a' followed by 'b' followed by 'c'\" is not followed by \"2\""
      );
    });
    it("should handle lookbehinds", () => {
      expect(parseRegex(/(?<=not) good/)).toEqual(
        "Match \" good\" only if \" good\" follows \"'n' followed by 'o' followed by 't'\""
      );
      expect(parseRegex(/(?<!not) good/)).toEqual(
        "Match \" good\" only if \" good\" does not follow \"'n' followed by 'o' followed by 't'\""
      );
    });
  });
  describe("quantifier handling", () => {
    it("should evaluate ranges with only a ending range literally", () => {
      expect(parseRegex(/7{,2}/)).toEqual(
        "Match '7' followed by '{' followed by ',' followed by '2' followed by '}'"
      );
    });
    it("should handle errors", () => {
      expect(parseRegex("/7{5,4}/")).toEqual(
        "SyntaxError: Invalid regular expression: /7{5,4}/: numbers out of order in {} quantifier"
      );
    });
    it("should handle valid quantifiers", () => {
      expect(parseRegex("/7{2,5}a/")).toEqual(
        "Match \"'7' between two and five times\" followed by 'a'"
      );
      expect(parseRegex("/7+/")).toEqual("Match \"'7' one or more times\"");
      expect(parseRegex("/7?/")).toEqual("Match \"'7' zero or one time\"");
      expect(parseRegex("/7*/")).toEqual("Match \"'7' zero or more times\"");
    });
  });
  describe("dot", () => {
    it("should handle dot when dotall flag is not set", () => {
      expect(parseRegex("/.+/")).toEqual(
        "Match \"'any character except line breaks' one or more times\""
      );
    });
    it("should handle dot when dotall flag is set", () => {
      expect(parseRegex(/.+/s)).toEqual(
        "Match \"'any character' one or more times\" using dotall (allowing '.' to match newlines) search"
      );
    });
  });
  describe("unicode", () => {
    it("should handle \\uHHH format", () => {
      expect(parseRegex(/\u0041/)).toEqual("Match 'A'");
      expect(parseRegex(/\u0041b/)).toEqual("Match 'A' followed by 'b'");
      expect(parseRegex("/\u0041b/")).toEqual("Match 'A' followed by 'b'");
      expect(parseRegex(/a\u0041b/)).toEqual(
        "Match 'a' followed by 'A' followed by 'b'"
      );
    });
    it("should handle \\u{HHHH} format if unicode flag is set", () => {
      expect(parseRegex(/\u{0041}+/gimu)).toEqual(
        "Match \"'A' one or more times\" using global, case-insensitive, multiline, and unicode search"
      );
      expect(parseRegex(/a\u{0041}b*/u)).toEqual(
        "Match 'a' followed by 'A' followed by \"'b' zero or more times\" using unicode search"
      );
      expect(parseRegex(/\u{0041}?/u)).toEqual(
        "Match \"'A' zero or one time\" using unicode search"
      );
    });
    it("should handle invalid unicode", () => {
      expect(parseRegex(/\u02/)).toEqual(
        "Match 'u' followed by '0' followed by '2'"
      );
    });
  });
  describe("hexadecimal", () => {
    it("should handle a valid hexadecimal", () => {
      expect(parseRegex("/\x41/")).toEqual("Match 'A'");
      expect(parseRegex(/\x41/)).toEqual("Match 'A'");
    });
    it("should treat characters literally if not valid hex", () => {
      expect(parseRegex(/\xgg/)).toEqual(
        "Match '\\' followed by 'x' followed by 'g' followed by 'g'"
      );
    });
  });
  describe("character classes", () => {
    it("should handle form-feed character", () => {
      expect(parseRegex(/\fa/)).toEqual("Match 'a form-feed' followed by 'a'");
    });
    it("should handle line-break characters", () => {
      expect(parseRegex(/\na?/)).toEqual(
        "Match 'a linefeed' followed by \"'a' zero or one time\""
      );
      expect(parseRegex(/\ra/)).toEqual(
        "Match 'a carriage return' followed by 'a'"
      );
      expect(parseRegex("/\\sFin\\./")).toEqual(
        "Match 'any space, tab, or line break' followed by 'F' followed by 'i' followed by 'n' followed by a period"
      );
    });
    it("should handle digit classes", () => {
      expect(parseRegex(/\d{1,3}/)).toEqual(
        "Match \"'any digit between 0 and 9' between one and three times\""
      );
      expect(parseRegex(/\D{3,}/)).toEqual(
        "Match \"'any non-digit' at least three times\""
      );
    });
    it("should handle letter classes", () => {
      expect(parseRegex(/\w123/)).toEqual(
        "Match 'any letter between a and z or any letter between A and Z or any digit between 0 and 9 or an underscore' followed by '1' followed by '2' followed by '3'"
      );
      expect(parseRegex(/\W12/)).toEqual(
        "Match 'any character that is not between a and z or between A and Z or between 0 and 9 and not an underscore' followed by '1' followed by '2'"
      );
    });
    it("should handle word classes", () => {
      expect(parseRegex(/\bcat/)).toEqual(
        "Match 'a word character not followed by another word character' followed by 'c' followed by 'a' followed by 't'"
      );
      expect(parseRegex(/\Bcat/)).toEqual(
        "Match 'a word character followed by another word character' followed by 'c' followed by 'a' followed by 't'"
      );
    });
  });
  describe("backreferences", () => {
    it("should handle named backreferences", () => {
      expect(parseRegex(/(?<test>test)\k<test>/)).toEqual(
        "Match \"test\" (creating a named capture group by the name of 'test') followed by the repeat of named capture group 'test' containing \"test\""
        );
      expect(parseRegex(/(?<test>test)\1/)).toEqual(
        "Match \"test\" (creating a named capture group by the name of 'test') followed by the repeat of capture group containing \"test\""
      );
    });
    it("should handle other backreferences", () => {
      expect(
        parseRegex(
          /(ABC) as easy as (123), simple as do re mi, \1, \2, baby, you and me, girl/
        )
      ).toEqual(
        "Match \"ABC\" (creating a capture group) followed by ' ' followed by 'a' followed by 's' followed by ' ' followed by 'e' followed by 'a' followed by 's' followed by 'y' followed by ' ' followed by 'a' followed by 's' followed by ' ' followed by \"123\" (creating a capture group) followed by ',' followed by ' ' followed by 's' followed by 'i' followed by 'm' followed by 'p' followed by 'l' followed by 'e' followed by ' ' followed by 'a' followed by 's' followed by ' ' followed by 'd' followed by 'o' followed by ' ' followed by 'r' followed by 'e' followed by ' ' followed by 'm' followed by 'i' followed by ',' followed by ' ' followed by the repeat of capture group containing \"ABC\" followed by ',' followed by ' ' followed by the repeat of capture group containing \"123\" followed by ',' followed by ' ' followed by 'b' followed by 'a' followed by 'b' followed by 'y' followed by ',' followed by ' ' followed by 'y' followed by 'o' followed by 'u' followed by ' ' followed by 'a' followed by 'n' followed by 'd' followed by ' ' followed by 'm' followed by 'e' followed by ',' followed by ' ' followed by 'g' followed by 'i' followed by 'r' followed by 'l'"
        );
    });
  });
  describe("other types of escapes", () => {
    it("should treat escaped special characters literally", () => {
      expect(parseRegex(/\++/)).toEqual(
        "Match \"'the '+' symbol' one or more times\""
      );
      expect(parseRegex(/\$$/)).toEqual(
        "Match 'the '$' symbol' to the end of the string"
      );
      expect(parseRegex(/\.pdf/)).toEqual(
        "Match a period followed by 'p' followed by 'd' followed by 'f'"
      );
      expect(parseRegex(/\|\?\(\)/)).toEqual(
        "Match 'the '|' symbol' followed by 'a question mark' followed by 'the '(' symbol' followed by 'the ')' symbol'"
      );
    });
  });
});
