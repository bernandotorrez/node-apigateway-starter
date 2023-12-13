const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
// const jwt = require('jsonwebtoken');
// const rateLimit = require('../../utils/rateLimiter');
// const tokenManager = require('../../utils/tokenManager');

// Repositories
const TodoRepository = require('../../repositories/firebase/todoRepository');
const todoRepository = new TodoRepository();

// Validator
const todoValidator = require('../../validators/todoValidator');

router.get('/', async (req, res) => {
    const todos = await todoRepository.getTodos();

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: todos
    });
});

router.post('/', async (req, res) => {
    todoValidator.CreateTodoValidator(req.body);

    const createTodo = await todoRepository.createTodo({
        todo_name: req.body.todo_name
    });

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: createTodo
    });
});

module.exports = router;