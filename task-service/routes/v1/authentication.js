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
    const { username, password } = req.body;

    try {
        const user = await userRepository.register({ username, password });

        res.status(httpStatus.OK).json({
            code: httpStatus.OK,
            status: 'SUCCESS',
            message: httpStatus[`${httpStatus.OK}_NAME`],
            data: user
         });
    } catch (error) {
        res.status(httpStatus.OK).json({
            code: httpStatus.OK,
            status: 'ERROR',
            message: error.message,
            data: null
         });
    }
})

router.post('/login', rateLimit, async (req, res) => {
    const { username, password } = req.body;

    try {

        const user = await userRepository.login({ username, password });

        const data = {
            username: user.username,
            level: user.level,
        };

        const payload = {
            data,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }
        
        const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);
        
        res.header('X-Auth-Token', token);  
        res.status(httpStatus.OK).json({
            code: httpStatus.OK,
            status: 'SUCCESS',
            message: httpStatus[`${httpStatus.OK}_NAME`],
            data: data.username
         });
    } catch (error) {
        res.status(httpStatus.OK).json({
            code: httpStatus.NOT_FOUND,
            status: 'ERROR',
            message: error.message,
            data: null
        }) 
    }
})

module.exports = router;