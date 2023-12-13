class ServerError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
