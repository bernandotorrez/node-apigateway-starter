const ClientError = require('./ClientError');

class BadRequestError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;
