class InvalidRegularExpression extends Error {
  constructor(specificMessage, ...params) {
    super(...params);
    this.name = "Invalid Regular Expression";
    this.message = specificMessage;
  }
}

module.exports = InvalidRegularExpression;
