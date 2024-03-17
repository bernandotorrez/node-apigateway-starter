const globalFunction = require('../utils/');
const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

function auth (req, res, next) {
  const token = globalFunction.checkNull(req.header('X-Auth-Token'));

  if (token === '-') {
    throw new AuthenticationError('Token is Empty');
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      req.user = decoded;
      next();
    } catch (ex) {
      if (ex instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token is Expired');
      } else {
        throw new AuthenticationError('Token is Invalid');
      }
    }
  }
}

module.exports = auth;
