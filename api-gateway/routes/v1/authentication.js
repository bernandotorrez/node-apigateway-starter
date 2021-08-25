const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');
const apiAdapter = require('../../utils/apiAdapter.js');
const { URL_SERVICE_TASK } = process.env
const api = apiAdapter(URL_SERVICE_TASK);

router.get('/', async (req, res) => {
   const task = await api.get('/v1/task')
   return res.json(task.data)

})

module.exports = router;