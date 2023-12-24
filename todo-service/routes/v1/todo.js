const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
// const jwt = require('jsonwebtoken');
const rateLimit = require('../../utils/rateLimiter');
// const tokenManager = require('../../utils/tokenManager');

// Repositories
const TodoRepository = require('../../repositories/firebase/todoRepository');
const todoRepository = new TodoRepository();

// Validator
const todoValidator = require('../../validators/todoValidator');

// Cached
const CacheRepository = require('../../repositories/redis/cacheRepository');
const cacheRepository = new CacheRepository();

router.get('/', rateLimit, async (req, res) => {
    try {
        const todos = await cacheRepository.get(`todo:all`);
  
        res.status(httpStatus.OK).json({
           code: httpStatus.OK,
           status: 'SUCCESS',
           message: httpStatus[`${httpStatus.OK}_NAME`],
           data: JSON.parse(todos)
        });
     } catch (err) {
        const todos = await todoRepository.getTodos();
  
        await cacheRepository.set(`todo:all`, JSON.stringify(todos), 60);
  
        res.status(httpStatus.OK).json({
           code: httpStatus.OK,
           status: 'SUCCESS',
           message: httpStatus[`${httpStatus.OK}_NAME`],
           data: todos
        });
     }
});

router.post('/', rateLimit, async (req, res) => {
    todoValidator.CreateTodoValidator(req.body);

    const createTodo = await todoRepository.createTodo({
        todo_name: req.body.todo_name,
    });

    if(createTodo) {
        await cacheRepository.delete('todo:all');
    }

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: createTodo
    });
});

router.get('/get/:uuid?', rateLimit, async (req, res) => {
    const { uuid } = req.params;

    try {
        const todo = await cacheRepository.get(`todo:${uuid}`);
  
        res.status(httpStatus.OK).json({
           code: httpStatus.OK,
           status: 'SUCCESS',
           message: httpStatus[`${httpStatus.OK}_NAME`],
           data: JSON.parse(todo)
        });
    } catch (err) {
        const todo = await todoRepository.getOneTodo(uuid);

        await cacheRepository.set(`todo:${uuid}`, JSON.stringify(todo), 60);

        res.status(httpStatus.OK).json({
            code: httpStatus.OK,
            status: 'SUCCESS',
            message: httpStatus[`${httpStatus.OK}_NAME`],
            data: todo
        });
    }
});

router.put('/:uuid?', rateLimit, async (req, res) => {
    todoValidator.CreateTodoValidator(req.body);

    const { uuid } = req.params;
    const { todo_name } = req.body;

    const updateTodo = await todoRepository.updateTodo({
        uuid,
        todo_name
    });

    if(updateTodo) {
        await cacheRepository.delete('todo:all');
        await cacheRepository.delete(`todo:${uuid}`);
    }

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: updateTodo
    });
});

router.delete('/:uuid?', rateLimit, async (req, res) => {
    const { uuid } = req.params;

    const todo = await todoRepository.deleteTodo(uuid);

    if(todo) {
        await cacheRepository.delete('todo:all');
        await cacheRepository.delete(`todo:${uuid}`);
    }

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: httpStatus[`${httpStatus.OK}_NAME`],
        data: todo
    });
});

module.exports = router;