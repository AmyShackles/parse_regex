## Error Conditions

- number of left parens is greater than or equal to 2^32 - 1
- If a group name is used more than once
- In { firstDigit, secondDigit }, if firstDigit is greater than secondDigit
- If a range has a character class as the beginning or ending of the range
- If a range has a higher starting point than ending point
- In a escaped decimal, if the number being escaped is greater than the number of left parentheses (since \decimal is a backreference)
