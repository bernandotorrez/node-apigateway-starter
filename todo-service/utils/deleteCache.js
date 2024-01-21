const cacheRepository = require('../repositories/redis/cacheRepository');

bulkDelete = async (prefix) => {
    const keys = await cacheRepository.keys(prefix);

    keys.forEach(async key => {
        const deleted = await cacheRepository.delete(key);

        if(deleted) {
            console.info(`(Redis) Key : ${key} is deleted`);
        }
    });
};

module.exports = bulkDelete;