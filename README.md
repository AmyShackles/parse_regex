# parse_regex

Project to house a tool to translate regular expressions into English and vice versa

The goal of this project is to be able to provide self-documentation of regular expressions.

Still to do:

- Include logic for '.' when unescaped
- Include logic for dealing with flags
- Turn this into a program that can take command line arguments.  *facepalm*

Requirements to run locally:
- Node installed globally 
- yarn installed globally (only if running tests)

Instructions to run program currently:

- Clone repo
- cd into folder
- to see what regular expression program is testing against, refer to the last line in index.js
- to change it to a different regular expression, change the regular expression being passed to the function in index.js
- `node index.js`

To run tests:
- `yarn` to install dependencies
- `yarn test` to run tests
