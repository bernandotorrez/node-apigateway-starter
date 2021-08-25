const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const rateLimit = require('../../utils/rateLimiter');

// Repositories
const UserRepository = require('../../repositories/mysql/userRepository');
const userRepository = new UserRepository();

const CacheRepository = require('../../repositories/redis/cacheRepository');
const cacheRepository = new CacheRepository();

router.post('/register', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = await userRepository.register({
        username,
        password
    });

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: user
    });
})

router.post('/login', rateLimit, async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = await userRepository.login({
        username,
        password
    });

    const data = {
        username: user.username,
        level: user.level,
    };

    const payload = {
        data
    }

    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' });

    res.header('X-Auth-Token', token);
    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: data.username
    });
})

module.exports = router;