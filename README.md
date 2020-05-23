# parse_regex

Project to house a tool to translate regular expressions into English and vice versa

The goal of this project is to be able to provide self-documentation of regular expressions.

Still to do:

- Include logic for '.' when unescaped
- Include logic for dealing with flags

Requirements to run locally:
- Node installed globally
- yarn installed globally (only if running tests)

Instructions to run program currently:

- Clone repo
- cd into folder
- Run `node index.js` and type a regular expression at the prompt, or you may
  pass it as an argument

To run tests:
- `yarn` to install dependencies
- `yarn test` to run tests
