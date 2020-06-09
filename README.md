# parse_regex

Project to house a tool to translate regular expressions into English

If you would like to see this functionality in VSCode extension form, that repo can be found at https://github.com/AmyShackles/vscode_extension_parseregex

The goal of this project is to be able to provide self-documentation of regular expressions.

Requirements to run locally:

- Node installed globally
- yarn installed globally (only if running tests)

Instructions to run program currently:

- Clone repo
- cd into folder
- Run `node index.js` and type a regular expression at the prompt, or you may
  pass it as an argument
  
Example usage:

`node index.js`
```
> /abc/gi
"Match 'a' followed by 'b' followed by 'c' using global and case-insensitive search"
> ^123$
"Match '1' followed by '2' followed by '3' to the start and end of the line"
> /.*\.txt$/
`Match "'any character except line breaks' zero or more times" followed by 'the '.' symbol' followed by 't' followed by 'x' followed by 't' to the end of the line`
```

To run tests:

- `yarn` to install dependencies
- `yarn test` to run tests
