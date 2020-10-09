const { promisify } = require('util');
const redis = require("redis");
const client = redis.createClient(6379);

// Exports
export const smembers = promisify(client.smembers).bind(client);
export const zrange = promisify(client.zrange).bind(client);
export const zrangebyscore = promisify(client.zrangebyscore).bind(client);
export const zrevrangebyscore = promisify(client.zrevrangebyscore).bind(client);
export const hgetall = promisify(client.hgetall).bind(client);
export const hmset = promisify(client.hmset).bind(client);
export const rpush = promisify(client.rpush).bind(client);
export const zadd = promisify(client.zadd).bind(client);

export const batch = function(commands) {
    const b = client.batch(commands)
    return promisify(b.exec).bind(b)();
}

// Subscribe function
export const subscribe = function(channel, callback) {
    console.log('Subscribing to', channel);
    const sub = redis.createClient(6379);
    sub.on("message", function(channel, message) {
        callback(message);
    });
    sub.subscribe(channel);

    const unsubscribe = () => console.log('TODO: Actually unsubscribe from redis and close client');

    return unsubscribe;

}