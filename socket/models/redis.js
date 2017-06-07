const Promise = require('bluebird');
const rediz = require('redis');
Promise.promisifyAll(rediz.RedisClient.prototype);
Promise.promisifyAll(rediz.Multi.prototype);
const redis = rediz.createClient({ "host": "127.0.0.1", "port": "6379" });

redis.on('error', function (err) { console.log('errorevent - ' + redis.host + ':' + redis.port + ' - ' + err); });

module.exports = redis;