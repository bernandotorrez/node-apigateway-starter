const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' }),
  generateRefreshToken: (payload) => jwt.sign(payload, process.env.JWT_REFRESH_TOKEN),
  verifyRefreshToken: (refreshToken) => {
    try {
      const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
      return user;
    } catch (error) {
      throw new InvariantError('Refresh Token not Valid');
    }
  }
};

module.exports = TokenManager;
