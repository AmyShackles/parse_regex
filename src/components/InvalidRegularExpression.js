class InvalidRegularExpression extends Error {
  constructor(specificMessage, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidRegularExpression);
    }
    this.name = "Invalid Regular Expression";
    this.message = specificMessage || super.message;
  }
}

module.exports = InvalidRegularExpression;
