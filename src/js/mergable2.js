import forOwn from 'lodash/forOwn';
import has from 'lodash/has';
import values from 'lodash/values';
import view from './view';

export default (id, initial, resyncFunc) => {
    const subscribers = [];
    var values = initial;

    const subscribe = (subscriber) => {
        subscribers.push(subscriber);
        subscriber(values);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        }
    }

    const runSubscribers = () => {
        subscribers.forEach(subscriber => subscriber(values));
    }

    const replace = (update) => {
        forOwn(update , (value, field) => {
            values[field] = value;
        });
        values.keys().forEach(field => {
            if (!has(update, field)) {
                delete values[field];
            }
        });
        runSubscribers();

        // on replace, trigger all views
        reactors.keys().forEach(field => reactors[field].forEach(callback => callback(values)));
    }

    const merge = (update) => {
        forOwn(update , (value, field) => {
            values[field] = value;
        });
        runSubscribers();

        // on merge, only trigger views affected by changes
        // TODO trigger only relevant views, the following line triggers all of them
        reactors.keys().forEach(field => reactors[field].forEach(callback => callback(values)));
        return 
    }

    const reactors = {};

    return {
        subscribe,
        apply: (update, callback) => {
            const newVersion = update['v'];
            if (update.v === values.v + 1) {
                console.debug('Applying version ', newVersion);
                merge(update);
            } else if (newVersion > version) {
                console.debug(`Resyncing for ${id} since version ${newVersion} was not expected (currently ${version})`);
                resyncFunc(id).then(replace);
            }
        },
        registerTrigger: (triggers, callback) => {
            triggers.forEach(field => {
                if (!has(reactors[field])) {
                    reactors[field] = [];
                }
                reactors[field].push(callback);
            });
        }
    }
}
