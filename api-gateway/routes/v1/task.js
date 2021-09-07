const express = require('express');
require('express-async-errors');
const router = express.Router();

// API Adapter
const apiAdapter = require('../../utils/apiAdapter.js');
const { URL_TASK_SERVICE } = process.env
const api = apiAdapter(URL_TASK_SERVICE);

router.get('/', async (req, res) => {
   const accessToken = req.header('X-Auth-Token')
   const headers = {
      headers: {
         'X-Auth-Token': accessToken
      }
   }

   const task = await api.get('/v1/task', headers)
   return res.json(task.data)
})

router.get('/:id', async (req, res) => {
   const accessToken = req.header('X-Auth-Token')
   const headers = {
      headers: {
         'X-Auth-Token': accessToken
      }
   }

   const { id } = req.params;
   const task = await api.get(`/v1/task/${id}`, headers);
   return res.json(task.data)
})

router.post('/', async (req, res) => {
   const accessToken = req.header('X-Auth-Token')
   const headers = {
      headers: {
         'X-Auth-Token': accessToken
      }
   }

   const task = await api.post(`/v1/task`, req.body, headers);
   return res.json(task.data)
})

router.put('/:id', async (req, res) => {
   const accessToken = req.header('X-Auth-Token')
   const headers = {
      headers: {
         'X-Auth-Token': accessToken
      }
   }

   const { id } = req.params;
   const task = await api.put(`/v1/task/${id}`, req.body, headers);
   return res.json(task.data)
})

router.delete('/:id', async (req, res) => {
   const accessToken = req.header('X-Auth-Token')
   const headers = {
      headers: {
         'X-Auth-Token': accessToken
      }
   }

   const { id } = req.params;
   const task = await api.delete(`/v1/task/${id}`, headers);
   return res.json(task.data)
})

module.exports = router;