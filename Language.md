| Regular Expression 	| Type of Regular Expression  | English translation      	|
|--------------------	|--------------------------	|--------------------------	|
| ^                  	| Assertion                 | Match beginning of input 	|
| $                  	| Assertion                 | Match end of input       	|
| \b                  | Assertion                 | Match word boundary       |
| \B                  | Assertion                 | Match non-word boundary   |
| x (?= y)            | Assertion                 | Match x only if x is followed by y |
| x (?! y)            | Assertion                 | Match x only if x is not followed by y |
| (?<=y)x             | Assertion                 | Match x only if x follows y |
| (?<!y)x             | Assertion                 | Match x only if x does not follow y |
| \d                  | Character Class         | Match digit                  |
| \D                  | Character Class         | Match non-digit  |
| \w                  | Character Class         | Match word  |
| \W                  | Character Class         | Match non-word |
| \s                  | Character Class         | Match white space character |
| \S                  | Character Class         | Match non-white space character |
| \t                  | Character Class         | Match horizontal tab |
| \r                  | Character Class         | Match carriage return |
| \n                  | Character Class         | Match linefeed  |
| \v                  | Character Class         | Match vertical tab |
| \f                  | Character Class         | Match form feed |
| [\b]                | Character Class         | Match backspace |
| \0                  | Character Class         | Match NUL character |
| *                   | Quantifier              | Match preceding token 0 or more times |
| +                   | Quantifier              | Match preceding token 1 or more times |
| ?                   | Quantifier              | Match preceding token 0 or 1 times |
| {n}                 | Quantifier              | Match n occurrences of previous token |
