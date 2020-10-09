import { hmset, rpush, zadd } from './redis';
import mapValues from 'lodash/mapValues';
import uuid from 'uuid-random';

export const queue = (routingKey, params) => {
    const id = uuid();
    console.log('queue', id, routingKey)
    const metadata = {
        'routingKey': routingKey,
        'params': JSON.stringify(params)
    }
    return hmset(id, metadata).then(() => rpush('tasks', id));
}

// export const schedule = (routingKey, params) => {

// }