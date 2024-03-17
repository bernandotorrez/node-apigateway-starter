const ClientError = require('./ClientError');

class ConflictError extends ClientError {
  constructor (message) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
