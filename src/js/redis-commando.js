import { hgetall, zrange, zrangebyscore, zrevrangebyscore, batch } from './redis';
import zipObject from 'lodash/zipObject';
import map from 'lodash/map'
import mapValues from 'lodash/mapValues';
import forOwn from 'lodash/forOwn';

export const fetch = function(type, id) {
    console.log('fetching', type, id);
    return hgetall(type + '/' + id)
    .then(obj => mapValues(obj, val => JSON.parse(val)));
}

export const fetchAll = function(type) {
    return zrange(type, 0, -1).then(function(ids) {
        const reqs = ids.map(id => ['hgetall', type + '/' + id]);
        return batch(reqs).then(replies => zipObject(ids, map(replies, obj => mapValues(obj, val => JSON.parse(val)))));
    });
}

export const fetchByScore = function(type, num, reverse = false, max = "+inf") {
    return (reverse ? zrevrangebyscore : zrangebyscore)(type, max, '-inf', 'limit', 0, num).then(ids => {
        const reqs = ids.map(id => ['hgetall', type + '/' + id]);
        console.log(reqs);
        return batch(reqs).then(replies => zipObject(ids, map(replies, obj => mapValues(obj, val => JSON.parse(val)))));
    });
}

