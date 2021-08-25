const express = require('express');
require('express-async-errors');
const router = express.Router();

// API Adapter
const apiAdapter = require('../../utils/apiAdapter.js');
const { URL_SERVICE_TASK } = process.env
const api = apiAdapter(URL_SERVICE_TASK);

const ServerError = require('../../exceptions/ServerError');

router.get('/', async (req, res) => {
   try {
      const task = await api.get('/v1/task')
      return res.json(task.data)
   } catch (error) {
      throw new ServerError('Service Task Unavailable');
   }
})

router.get('/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const task = await api.get(`/v1/task/${id}`);
      return res.json(task.data)
   } catch (error) {
      throw new ServerError('Service Task Unavailable');
   }
})

module.exports = router;