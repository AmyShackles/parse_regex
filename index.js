const { parseRegex } = require("./src/components/parseRegex");
const repl = require("repl");

function evaluate(cmd, context, filename, callback) {
  callback(null, parseRegex(cmd));
}

const initializeRepl = () => {
  const replServer = repl.start({
    prompt: "> ",
    input: process.stdin,
    output: process.stdout,
    eval: evaluate,
  });
  replServer.on("exit", () => {
    console.log("Have a nice day!");
    process.exit(0);
  });
  replServer.defineCommand("end", {
    help: "Exits the program",
    action(name) {
      this.clearBufferedCommand();
      console.log("Have a nice day!");
      process.exit(0);
    },
  });
  replServer.defineCommand("quit", {
    help: "Exits the program",
    action(name) {
      this.clearBufferedCommand();
      console.log("Have a nice day!");
      process.exit(0);
    },
  });
  replServer.defineCommand("q", {
    help: "Exits the program",
    action(name) {
      this.clearBufferedCommand();
      console.log("Have a nice day!");
      process.exit(0);
    },
  });
};
if (require.main == module) {
  if (process.argv.length >= 3) {
    // Take input from argument
    console.log(parseRegex(process.argv[2]));
  } else {
    // Interactive prompt
    initializeRepl();
  }
}

module.exports = { initializeRepl };
