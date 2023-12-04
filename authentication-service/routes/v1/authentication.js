const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const rateLimit = require('../../utils/rateLimiter');
const tokenManager = require('../../utils/tokenManager');

// Repositories
const UserRepository = require('../../repositories/mysql/userRepository');
const userRepository = new UserRepository();

const RefreshTokenRepository = require('../../repositories/mysql/refreshTokenRepository');
const refreshTokenRepository = new RefreshTokenRepository();

const CacheRepository = require('../../repositories/redis/cacheRepository');
const cacheRepository = new CacheRepository();

const { db, getDocs, collection } = require('../../repositories/firebase/firebaseRepository');

// Validator
const authenticationValidator = require('../../validators/authenticationValidator');

// Model
const todoModel = require('../../models/firebase/todo');

router.get('/firebase', async (req, res) => {
    const todos = await getDocs(collection(db, 'todo'));
    const todosArray = [];

    todos.forEach(doc => {
        const todo = new todoModel(
            doc.data().uuid, 
            doc.data().todo_name, 
            doc.data().status, 
            doc.data().is_active
        );
        todosArray.push(todo);
    });

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: todosArray
    });

});

router.post('/register', async (req, res) => {
    authenticationValidator.RegisterValidator(req.body);

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
        data: {
            user: user.username,
            level: user.level,
            created_at: user.created_at
        }
    });
})

router.post('/login', rateLimit, async (req, res) => {
    authenticationValidator.LoginValidator(req.body);

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

    const accessToken = tokenManager.generateAccessToken(payload);
    const refreshToken = tokenManager.generateRefreshToken(payload);

    await refreshTokenRepository.addRefreshToken({ token: refreshToken });

    res.header('X-Auth-Token', accessToken);
    res.header('X-Auth-Refresh-Token', refreshToken);
    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: data.username
    });
})

router.put('/refresh-token', async (req, res) => {
    const refreshToken = req.header('X-Auth-Refresh-Token');
    await refreshTokenRepository.verifyRefreshToken({ token: refreshToken });
    const decoded = tokenManager.verifyRefreshToken(refreshToken);
    
    const data = {
        username: decoded.data.username,
        level: decoded.data.level,
    };

    const payload = {
        data
    }

    const accessToken = tokenManager.generateAccessToken(payload);
    res.header('X-Auth-Token', accessToken);
    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: data.username
    });
})

router.delete('/logout', async (req, res) => {
    const refreshToken = req.header('X-Auth-Refresh-Token');
    await refreshTokenRepository.verifyRefreshToken({ token: refreshToken });
    await refreshTokenRepository.deleteRefreshToken({ token: refreshToken });

    res.header('X-Auth-Token', '');
    res.header('X-Auth-Refresh-Token', '');
    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: 'logged out'
    });
})

module.exports = router;