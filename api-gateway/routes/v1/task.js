const express = require('express');
require('express-async-errors');
const router = express.Router();

// API Adapter
const apiAdapter = require('../../utils/apiAdapter.js');
const { URL_TASK_SERVICE } = process.env
const api = apiAdapter(URL_TASK_SERVICE);

router.get('/', async (req, res) => {
   const task = await api.get('/v1/task')
   return res.json(task.data)
})

router.get('/:id', async (req, res) => {
   const { id } = req.params;
   const task = await api.get(`/v1/task/${id}`);
   return res.json(task.data)
})

router.post('/', async (req, res) => {
   const task = await api.post(`/v1/task`, req.body);
   return res.json(task.data)
})
module.exports = router;