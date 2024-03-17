const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
const rateLimit = require('../../utils/rateLimiter');
const tokenManager = require('../../utils/tokenManager');

// Repositories
const userRepository = require('../../repositories/mysql/userRepository');

const refreshTokenRepository = require('../../repositories/mysql/refreshTokenRepository');

// Validator
const authenticationValidator = require('../../validators/authenticationValidator');

router.post('/register', async (req, res) => {
  authenticationValidator.AuthValidator(req.body);

  const { username, password } = req.body;

  const user = await userRepository.register({ username, password });

  const data = {
    username: user.username,
    level: user.level
  };

  const accessToken = tokenManager.generateAccessToken(data);
  const refreshToken = tokenManager.generateRefreshToken(data);

  await refreshTokenRepository.addRefreshToken({ token: refreshToken });

  res.header('X-Auth-Token', accessToken);
  res.header('X-Auth-Refresh-Token', refreshToken);
  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    success: true,
    message: 'Successfully Registered',
    data: {
      user: user.username,
      level: user.level,
      created_at: user.created_at
    }
  });
});

router.post('/login', rateLimit, async (req, res) => {
  authenticationValidator.AuthValidator(req.body);

  const { username, password } = req.body;

  const user = await userRepository.login({ username, password });

  const data = {
    username: user.username,
    level: user.level
  };

  const accessToken = tokenManager.generateAccessToken(data);
  const refreshToken = tokenManager.generateRefreshToken(data);

  await refreshTokenRepository.addRefreshToken({ token: refreshToken });

  res.header('X-Auth-Token', accessToken);
  res.header('X-Auth-Refresh-Token', refreshToken);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    success: true,
    message: 'Successfully Logged In',
    data: data.username
  });
});

router.put('/refresh-token', async (req, res) => {
  const refreshToken = req.header('X-Auth-Refresh-Token');
  await refreshTokenRepository.getRefreshToken({ token: refreshToken });
  const decoded = tokenManager.verifyRefreshToken(refreshToken);

  const data = {
    username: decoded.username,
    level: decoded.level
  };

  const accessToken = tokenManager.generateAccessToken(data);

  res.header('X-Auth-Token', accessToken);
  res.header('X-Auth-Refresh-Token', refreshToken);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    success: true,
    message: 'Successfully Refresh Token',
    data: data.username
  });
});

router.delete('/logout', async (req, res) => {
  const refreshToken = req.header('X-Auth-Refresh-Token');
  await refreshTokenRepository.getRefreshToken({ token: refreshToken });
  await refreshTokenRepository.deleteRefreshToken({ token: refreshToken });

  res.header('X-Auth-Token', '');
  res.header('X-Auth-Refresh-Token', '');
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    success: true,
    message: 'Successfully Logged Out',
    data: null
  });
});

module.exports = router;
