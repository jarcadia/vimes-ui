import { fetchAll, fetchByScore} from './redis-commando.js';
import { subscribe } from './redis';
import has from 'lodash/has';
import zipObject from 'lodash/zipObject';
import forOwn from 'lodash/forOwn';
import map from 'lodash/map';

export default () => {
    return (req, res, next) => {
        if (req.path.startsWith('/rcommando')) {
            if (req.method == "POST") {
                Promise.all(map(req.body, req => {
                    if (typeof req === 'string') {
                        console.log("Fetching all for type", req)
                        return fetchAll(req).then(data => ({type: req, data: data}));
                    } else if (typeof req === 'object') {
                        const type = req.type;
                        const dataLayout = req.dataLayout;
                        if (dataLayout === 'timeSeries') {
                            const limit = req.limit || 100;
                            return fetchByScore(type, limit, true).then(data => ({type: type, data: data}));
                        }
                    }
                })).then(postResults => {
                    const result = {};
                    postResults.forEach(({type, data}) => {
                        forOwn(data, (values, id) => {
                            result[type + '/' + id] = values;
                        });
                    });
                    return result;
                }).then(data => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                });
            }
            else {
                if (req.query.setKeys) {
                    const setKeys = req.query.setKeys.split(',');
                    Promise.all(setKeys.map(setKey => {
                        return fetchAll(setKey).then(setData => ({setKey: setKey, setData: setData}));
                    }))
                        .then(setItems => {
                            const data = {};
                            setItems.forEach(({setKey, setData}) => {
                                forOwn(setData, (values, id) => {
                                    data[setKey + ':' + id] = values;
                                });
                            });
                            return data;
                        })
                        .then(data => {
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(data));
                        });
                } else {
                    next();
                }
            }
        } else {
            next();
        }
    }
}
