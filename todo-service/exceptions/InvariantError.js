const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message, statusCode = 200) {
    super(message, statusCode);
    this.statusCode = statusCode;
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
