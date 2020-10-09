import { writable } from 'svelte/store';
import forOwn from 'lodash/forOwn';

export default (id, initial, resyncFunc) => {
    const { subscribe, update, set } = writable(initial);
    var version = initial.v || 0;
    return {
        subscribe,
        apply: (data) => {
            const newVersion = data['v'] || -1;
            if (newVersion === version + 1) {
                console.debug('Applying version ', newVersion);
                version = newVersion;
                update(obj => {
                    forOwn(data, (value, field) => {
                        obj[field] = value;
                    });
                    return obj;
                });
            } else if (newVersion > version) {
                console.debug('Resync request for', id, 'since version', newVersion, 'was not expected, current', version);
                return Promise.resolve(resyncFunc(id))
                .then(data => {
                    version = data.v;
                    set(data);
                });
            } else {
                console.debug('Ignoring update to ', id, 'with version', newVersion, 'existing version is', version);
            }
        }
    }
}
