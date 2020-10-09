import { queue } from '../../js/retask';

export function post(req, res, next) {
    //TODO verify body
    queue('deploy', req.body);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({}));
}
