| Regular Expression 	| Name  |  Type of Regular Expression  | English translation      	|
|--------------------	|--------------------------|--------------------------	|--------------------------	|
| ^                  	| | Assertion                 | Match beginning of input 	|
| $                  	| | Assertion                 | Match end of input       	|
| \b                  | | Assertion                 | Match word boundary       |
| \B                  | | Assertion                 | Match non-word boundary   |
| x (?= y)            | Positive Lookahead | Assertion                 | Match x only if x is followed by y |
| x (?! y)            | Negative Lookahead | Assertion                 | Match x only if x is not followed by y |
| (?<=y)x             | Positive Lookbehind | Assertion                 | Match x only if x follows y |
| (?<!y)x             | Negative Lookbehind | Assertion                 | Match x only if x does not follow y |
| .                   | Wildcard | Character Class | Matches any single character except terminators |
| \d                  | | Character Class         | Match digit                  |
| \D                  | | Character Class         | Match non-digit  |
| \w                  | | Character Class         | Match word  |
| \W                  | | Character Class         | Match non-word |
| \s                  | | Character Class         | Match white space character |
| \S                  | | Character Class         | Match non-white space character |
| \t                  | | Character Class         | Match horizontal tab |
| \r                  | | Character Class         | Match carriage return |
| \n                  | | Character Class         | Match linefeed  |
| \v                  | | Character Class         | Match vertical tab |
| \f                  | | Character Class         | Match form feed |
| [\b]                | | Character Class         | Match backspace |
| \0                  | | Character Class         | Match NUL character |
| *                   | | Quantifier              | Match preceding token 0 or more times |
| +                   | | Quantifier              | Match preceding token 1 or more times |
| ?                   | | Quantifier              | Match preceding token 0 or 1 times |
| {n}                 | | Quantifier              | Match n occurrences of previous token |
| {n,}                | | Quantifier              | Match at least n occurrences of previous token |
| {n, m}              | | Quantifier              | Match between n and m occurrences of previous token |
| ? after another quantier | | Quantifier         | Non-greedy match |
| x\|y                 | | Groups and Ranges       | Matches either x or y |
| [xyz]               | | Groups and Ranges       | Match any x, y, or z |
| [a-c]               | | Groups and Ranges       | Match character between a and c |
| [^xyz]              | | Groups and Ranges       | Do not match x, y, or z |
| (x)                 | | Capturing Group         | Groups and Ranges | Remember match x  |
| (<Name>x)           | Named Capturing Group   | Groups and Ranges | Remember match x as Name |
| (?:x)               | Non-capturing group     | Groups and Ranges | Match x, but do not remember it |
