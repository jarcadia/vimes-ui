import { writable, derived } from 'svelte/store';
import { tick } from 'svelte';

// import fstore from './filterStore';

import forEach from 'lodash/forEach'
import forOwn from 'lodash/forOwn'
import each from 'lodash/each'
import map from 'lodash/map'
import hasIn from 'lodash/hasIn'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'
import fromPairs from 'lodash/fromPairs'
import keys from 'lodash/keys'
import remove from 'lodash/remove'
import filter from 'lodash/filter'
import identity from 'lodash/identity'

export default (root, initialIteratee = identity) => {

    const iterateeSubscribers = [];
    var cachedIteratee = initialIteratee;
    const iterateeStore = {
        subscribe: subscription => {
            iterateeSubscribers.push(subscription);
            return () => {}
            // TODO return remove
        },
        set: iteratee => {
            cachedIteratee = iteratee;
            each(iterateeSubscribers, subscription => {
                subscription(iteratee);
            });

            forOwn(cachedValues, (values, id) => {
                doMap(id, true);
            });
        }
    }


    const subscribers = [];
    const subscribe = subscription => {
        subscribers.push(subscription)
        subscription(mappedValues);
        return () => {
            remove(subscribers, subscription);
            // if (subscribers.length === 0) {
            //     console.log('Unsubscribing from all sources');
            //     // Unscribe from all sources
            //     unsubscriber();
            //     forOwn(unsubscribers, (unsub, id) => {
            //         console.log('Unsubscribing from ', id);
            //     });
            // }
        }
    }

    const cachedValues = {};
    const mappedValues = {};
    var updates = undefined;
    const doMap = (id, async) => {
        const previous = mappedValues[id];
        const current = cachedIteratee(id, cachedValues[id]);
        if (!isEqual(previous, current)) {
            if (!async) {
                // Apply immediately
                mappedValues[id] = current;
                forEach(subscribers, subscription => {
                    // console.log('Invoking subscriber immediately with ', map);
                    subscription(mappedValues);
                });
            } else {
                if (updates === undefined) {
                    // console.log('Scheduling async update');
                    updates = {};
                    tick().then(() => {
                        // console.log('Applying async update');
                        merge(mappedValues, updates);
                        updates = undefined;
                        forEach(subscribers, subscription => {
                            // console.log('Invoking subscriber with ', map);
                            subscription(mappedValues);
                        });
                    });
                }
                // console.log('Detected change for', id, previous, current);
                updates[id] = current;
            }
        }
    }


    const unsubscribers = {};
    const rootUnsubscriber = root.subscribe(elements => {
        forEach(elements, ({id, store}) => {
            if (!hasIn(unsubscribers, id)) {
                // console.log('Subscribing to store for', id);
                unsubscribers[id] = store.subscribe(values => {
                    cachedValues[id] = values;
                    doMap(id, false);
                });
            }
            // TODO unsubscribe if element is gone
        });
    });



    return {
        subscribe: subscribe,
        iteratee: iterateeStore
    }
}