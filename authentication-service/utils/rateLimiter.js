const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const httpStatus = require('http-status');
const limiter = new RateLimit({
  store: new RedisStore({
    client: redis.createClient({
      host: process.env.REDIS_SERVER,
      port: process.env.REDIS_PORT,
      auth_user: process.env.REDIS_USER,
      auth_pass: process.env.REDIS_PASS
    })
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: {
    code: httpStatus.TOO_MANY_REQUESTS,
    success: false,
    message: httpStatus[`${httpStatus.TOO_MANY_REQUESTS}_NAME`],
    data: null
  }
});

module.exports = limiter;
