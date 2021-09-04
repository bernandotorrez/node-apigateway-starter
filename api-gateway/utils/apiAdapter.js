const axios = require('axios');
const { TIMEOUT } = process.env;

module.exports = (baseUrl, token = '') => {
    return axios.create({
        baseURL: baseUrl,
        timeout: parseInt(TIMEOUT),
        headers: {
          get: {
            'X-Auth-Token': token
          },
          post: {
            'X-Auth-Token': token
          },
          put: {
            'X-Auth-Token': token
          },
          delete: {
            'X-Auth-Token': token
          },
        }
      });
}