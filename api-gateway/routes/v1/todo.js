const express = require('express');
require('express-async-errors');
const router = express.Router();

// API Adapter
const apiAdapter = require('../../utils/apiAdapter.js');
const { URL_TODO_SERVICE } = process.env
const api = apiAdapter(URL_TODO_SERVICE);

router.get('/', async (req, res) => {
   const accessToken = req.header('X-Auth-Token')
   const headers = {
      headers: {
         'X-Auth-Token': accessToken
      }
   };

   const todo = await api.get('/v1/todo', headers);
   return res.json(todo.data);
});

router.get('/get/:uuid?', async (req, res) => {
    const accessToken = req.header('X-Auth-Token')
    const headers = {
        headers: {
            'X-Auth-Token': accessToken
        }
    }

    const { id } = req.params;
    const todo = await api.get(`/v1/todo/${id}`, headers);
    return res.json(todo.data)
});

router.post('/', async (req, res) => {
    const accessToken = req.header('X-Auth-Token')
    const headers = {
        headers: {
            'X-Auth-Token': accessToken
        }
    }

    // Body
    const { todo_name } = req.body;

    const body = {
        todo_name
    }

    const todo = await api.post(`/v1/todo`, body, headers);
    return res.json(todo.data)
})

router.put('/:uuid?', async (req, res) => {
    const accessToken = req.header('X-Auth-Token')
    const headers = {
        headers: {
            'X-Auth-Token': accessToken
        }
    }

    // Param
    const { uuid } = req.params;

    // Body
    const { todo_name } = req.body;

    const body = {
        todo_name
    }

    const todo = await api.put(`/v1/todo/${uuid}`, body, headers);
    return res.json(todo.data)
})

module.exports = router;