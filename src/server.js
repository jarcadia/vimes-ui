const http = require('http');
import polka from 'polka';
import bodyParser from 'body-parser';
import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { subscribe } from './js/redis';
import  rcommandoMiddleware  from './js/redis-commando-middleware';
import { queue } from './js/retask';
import { fetch } from './js/redis-commando';

import mapKeys from 'lodash/mapKeys';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const io = require('socket.io')({
    serveClient: false,
});

console.log('Starting server');
const server = http.createServer();
polka({ server })
    .use(
        compression({ threshold: 0 }),
        sirv('static', { dev }),
        bodyParser.json(),
        rcommandoMiddleware(),
        sapper.middleware()
    )
    .listen(PORT, err => {
        if (err) console.error(err);
    });

const subscriptions = {};

io.attach(server);
io.on('connection', socket => {
    console.log('Connection established');

    socket.on('subscribe', req => {
        req.forEach(type => {
            console.log('Client has asked to subscribe to', type);
            if (!(type in subscriptions)) {
                subscriptions[type] = subscribe(type  + '.change', msg => {
                    const change = mapKeys(JSON.parse(msg), (values, id) => type + '/' + id);
                    // console.debug('Received change', type, change);
                    io.to(type).emit('change', change);
                });
            }
            socket.join(type);
        });
    });

    socket.on('resync', (type, id) => {
        console.log('Resyncing', type + '/' + id, 'from redis');
        const resync = {};
        fetch(type, id).then(values => {
            values.isResync = true;
            resync[type + '/' + id] = values;
            io.to(type).emit('change', resync);
        });

    });

    socket.on('discover.instances', data => {
        queue('discover.instances', data);
    });

    socket.on('discover.artifacts', data => {
        queue('discover.artifacts', data);
    });

    socket.on('deploy.artifact', data => {
        queue('deploy.artifact', data);
    });

    socket.on('deploy.restart', data => {
        queue('deploy.restart', data);
    });

    socket.on('deploy.cancel.deployment', id => {
        queue('deploy.cancel.deployment', {'deployment': id});
    });
});

// TODO: Reaper. Following code to check active, for reaper
// io.sockets.in(setKey).clients((error, clients) => {
//     console.log('Number of clients subscribed to', setKey, clients.length);
// });

