const express = require('express');
require('express-async-errors');
const router = express.Router();

// API Adapter
const apiAdapter = require('../../utils/apiAdapter.js');
const { URL_TODO_SERVICE } = process.env
const api = apiAdapter(URL_TODO_SERVICE);

router.get('/', async (req, res) => {
    const { next } = req.query;

    const accessToken = req.header('X-Auth-Token')
    const headers = {
        headers: {
            'X-Auth-Token': accessToken
        }
    };

    let url;

    if(next) {
        url = `v1/todo?next=${next}`;
    } else {
        url = 'v1/todo';
    }

    const todo = await api.get(url, headers);
    return res.json(todo.data);
});

router.get('/get/:uuid?', async (req, res) => {
    const accessToken = req.header('X-Auth-Token')
    const headers = {
        headers: {
            'X-Auth-Token': accessToken
        }
    }

    const { uuid } = req.params;
    const todo = await api.get(`/v1/todo/${uuid}`, headers);
    return res.json(todo.data)
});

router.post('/', async (req, res) => {
    const accessToken = req.header('X-Auth-Token')
    const headers = {
        headers: {
            'X-Auth-Token': accessToken
        }
    }

    const todo = await api.post(`/v1/todo`, req.body, headers);
    return res.json(todo.data)
})

router.put('/:uuid?', async (req, res) => {
    const accessToken = req.header('X-Auth-Token')
    const headers = {
        headers: {
            'X-Auth-Token': accessToken
        }
    }

    const todo = await api.put(`/v1/todo/${uuid}`, req.body, headers);
    return res.json(todo.data)
})

router.delete('/:uuid?', async (req, res) => {
   const accessToken = req.header('X-Auth-Token')
   const headers = {
      headers: {
         'X-Auth-Token': accessToken
      }
   }

   const { uuid } = req.params;
   const task = await api.delete(`/v1/task/${uuid}`, headers);
   return res.json(task.data)
})

module.exports = router;