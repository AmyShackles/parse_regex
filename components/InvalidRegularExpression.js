class InvalidRegularExpression extends Error {
  constructor(message) {
    super(message);
    this.name = "Invalid Regular Expression";
    this.message = message;
  }
}

module.exports = InvalidRegularExpression;
