const redis = require('redis');

class CacheRepository {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
      port: process.env.REDIS_PORT,
      auth_user: process.env.REDIS_USER,
      auth_pass: process.env.REDIS_PASS
    });

    this._client.on('error', (error) => {
      throw error;
    });
  }

  set(key, value, expirationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
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

  keys(keys) {
    return new Promise((resolve, reject) => {
      this._client.keys(keys, (error, count) => {
        if (error) {
          return reject(error);
        }

        return resolve(count);
      });
    });
  }
}

module.exports = CacheRepository;