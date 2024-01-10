const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
const deleteCache = require('../../utils/deleteCache');

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

    try {
        const todos = await cacheRepository.get(`todo:${next}`)

        res.status(httpStatus.OK).json({
            code: httpStatus.OK,
            status: 'SUCCESS',
            message: httpStatus[`${httpStatus.OK}_NAME`],
            data: JSON.parse(todos)
        });
    } catch (error) {
        const todos = await todoRepository.getTodosCursor(next);

        await cacheRepository.set(`todo:${next}`, JSON.stringify(todos), 60);

        res.status(httpStatus.OK).json({
            code: httpStatus.OK,
            status: 'SUCCESS',
            message: httpStatus[`${httpStatus.OK}_NAME`],
            data: todos
        });
    }
});

router.post('/', async (req, res) => {
    todoValidator.CreateTodoValidator(req.body);

    const createTodo = await todoRepository.createTodo({
        todo_name: req.body.todo_name,
    });

    if(createTodo) {
        deleteCache('todo:*')
    }

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

    if(updateTodo) {
        deleteCache('todo:*')
    }

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

    if(todo) {
        deleteCache('todo:*')
    }

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: todo
    });
});

module.exports = router;