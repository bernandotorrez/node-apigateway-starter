const express = require('express');
require('express-async-errors');
const router = express.Router();

// API Adapter
const apiAdapter = require('../../utils/apiAdapter.js');
const { URL_AUTH_SERVICE } = process.env
const api = apiAdapter(URL_AUTH_SERVICE);

router.post('/login', async (req, res) => {
   const { username, password } = req.body;
   const user = await api.post('/v1/auth/login', { username, password });
   const accessToken = user.headers['x-auth-token'];
   const refreshToken = user.headers['x-auth-refresh-token'];
   res.header('X-Auth-Token', accessToken);
   res.header('X-Auth-Refresh-Token', refreshToken)
   return res.json(user.data)
})

router.post('/register', async (req, res) => {
   const { username, password } = req.body;
   const user = await api.post('/v1/auth/register', { username, password });
   return res.json(user.data);
})

module.exports = router;