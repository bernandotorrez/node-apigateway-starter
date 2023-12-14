const memjs = require('memjs')

class MemcachierRepository {
    constructor() {
      this._client = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
        username: process.env.MEMCACHIER_USERNAME,
        password: process.env.MEMCACHIER_PASSWORD,
        failover: true,  // default: false
        timeout: 1,      // default: 0.5 (seconds)
        keepAlive: true  // default: false
      })
    }
  
    set(key, value, expirationInSecond = 3600) {
      return new Promise((resolve, reject) => {
        this._client.set(key, value, expirationInSecond, (error, ok) => {
          if (error) {
            return reject(error);
          }
  
          return resolve(ok);
        });
      });
    }
  
    get(key) {
      return new Promise((resolve, reject) => {
        this._client.get(key, (error, reply) => {
          if (error) {
            return reject(error);
          }
  
          if (reply === null) {
            return reject(new Error('Nilai tidak ditemukan'));
          }
  
          return resolve(reply.toString());
        });
      });
    }
  
    delete(key) {
      return new Promise((resolve, reject) => {
        this._client.del(key, (error, count) => {
          if (error) {
            return reject(error);
          }
  
          return resolve(count);
        });
      });
    }
  }
  
  module.exports = MemcachierRepository;