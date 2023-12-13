const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
// const jwt = require('jsonwebtoken');
// const rateLimit = require('../../utils/rateLimiter');
// const tokenManager = require('../../utils/tokenManager');

// Repositories
const { db, getDocs, collection } = require('../../repositories/firebase/firebaseRepository');

// Validator
// const authenticationValidator = require('../../validators/authenticationValidator');

// Model
const todoModel = require('../../models/firebase/todo');

router.get('/', async (req, res) => {
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

module.exports = router;