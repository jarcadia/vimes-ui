import subscriptionManager from './subscription-manager';
import { writable } from 'svelte/store';

import has from 'lodash/has';
import forOwn from 'lodash/forOwn';
import sortedIndex from 'lodash/sortedIndex';

export default (store, paramStore, iteratee) => {
    const stores = {};
    const cache = {}
    const pass = {};

    var params = undefined;

    paramStore.subscribe(update => {
        params = update;
        var trigger = false;
        forOwn(cache, (obj, id) => {
            trigger = check(id, obj) || trigger;
        });
        if (trigger) view.trigger();
    });

    const check = (id, obj) => {
        const isVisible = iteratee(params, id, obj);
        const wasVisible = pass[id];
        if (isVisible !== wasVisible) {
            pass[id] = isVisible;
            stores[id].set(isVisible);
            return true;
        } else {
            return false;
        }
    }

    const view = store.view(pass, (_, id, obj) => {
        if (obj === undefined) {
            const wasVisible = pass[id];
            delete stores[id];
            delete pass[id];
            return wasVisible;
        } else {
            if (!(id in stores)) {
                stores[id] = writable(false);
                cache[id] = obj;
            }
            return check(id, obj);
        }
    }, true);

    const get = id => {
        return {subscribe: stores[id].subscribe}
    }

    return {
        subscribe: view.subscribe,
        get
    }
}