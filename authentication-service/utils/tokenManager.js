const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const { URL, JWT_PRIVATE_KEY, JWT_REFRESH_TOKEN } = process.env;

const TokenManager = {
  generateAccessToken: (uuid, payload) => {
    const options = {
      expiresIn: '15m',
      issuer: URL,
      subject: uuid
    };

    return jwt.sign({ data: payload }, JWT_PRIVATE_KEY, options);
  },
  generateRefreshToken: (uuid, payload) => {
    const options = {
      issuer: URL,
      subject: uuid
    };

    return jwt.sign({ data: payload }, JWT_REFRESH_TOKEN, options);
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const user = jwt.verify(refreshToken, JWT_REFRESH_TOKEN);
      return user;
    } catch (error) {
      throw new InvariantError('Refresh Token not Valid');
    }
  }
};

module.exports = TokenManager;
