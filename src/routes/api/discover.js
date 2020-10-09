import { queue } from '../../js/retask';

export function get(req, res, next) {
    queue('discover.artifacts', {});
    queue('discover.instances', {});
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({}));
}