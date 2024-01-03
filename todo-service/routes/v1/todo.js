const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');

// Repositories
const TodoRepository = require('../../repositories/firebase/todoRepository');
const todoRepository = new TodoRepository();

// Validator
const todoValidator = require('../../validators/todoValidator');

// Cached
const CacheRepository = require('../../repositories/redis/cacheRepository');
const cacheRepository = new CacheRepository();

router.get('/', async (req, res) => {
    const { next } = req.query;

    const todos = await todoRepository.getTodosCursor(next);

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
        todo_name: req.body.todo_name,
    });

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: createTodo
    });
});

router.get('/get/:uuid?', async (req, res) => {
    const { uuid } = req.params;

    const todo = await todoRepository.getOneTodo(uuid);

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: todo
    });
});

router.put('/:uuid?', async (req, res) => {
    todoValidator.CreateTodoValidator(req.body);

    const { uuid } = req.params;
    const { todo_name } = req.body;

    const updateTodo = await todoRepository.updateTodo({
        uuid,
        todo_name
    });

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: updateTodo
    });
});

router.delete('/:uuid?', async (req, res) => {
    const { uuid } = req.params;

    const todo = await todoRepository.deleteTodo(uuid);

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: todo
    });
});

module.exports = router;