import subscriptionManager from './subscription-manager';
import { writable } from 'svelte/store';

import has from 'lodash/has';
import forOwn from 'lodash/forOwn';
import sortedIndex from 'lodash/sortedIndex';

export default (store, filterStore = undefined, single = false) => {
    const selection = [];
    const stores = {};
    const selected = {};
    const available = {};

    var nextDeselect = undefined;

    const addToSelection = id => {
        if (single && nextDeselect !== undefined) {
            console.log('Auto deselecting', nextDeselect);
            stores[nextDeselect].set(false);
        }
        selection.splice(sortedIndex(selection, id), 0, id);
        nextDeselect = id;
    }
    const removeFromSelection = id => {
        selection.splice(sortedIndex(selection, id), 1);
        if (nextDeselect === id) {
            nextDeselect = undefined;
        }
    }

    var numAvailable = 0;
    const numAvailableStore = writable(0);

    const collectiveStore = writable('none');
    var collective = 'none';
    const evalCollective = () => {
        const newCollective = selection.length === 0 ? 'none' : selection.length === numAvailable ? 'all' : 'partial';
        if (collective !== newCollective) {
            collective = newCollective;
            collectiveStore.set(collective);
        }
    }

    const view = store.view(selection, (_, id, obj) => {
        if (obj === undefined) {
            const wasInSelection = selected[id] && (filterStore === undefined || available[id]);

            delete stores[id];
            delete selected[id];
            delete available[id];

            if (wasInSelection) {
                removeFromSelection(id);
                return true;
            }
        } else {
            if (!(id in stores)) {
                stores[id] = writable(false);
                selected[id] = false;
                stores[id].subscribe(isSelected => {
                    if (selected[id] !== isSelected) {
                        selected[id] = isSelected;
                        if (filterStore === undefined || available[id]) {
                            (isSelected ? addToSelection : removeFromSelection)(id);
                            view.trigger();
                        }
                        evalCollective();
                    }
                });

                if (filterStore !== undefined) {
                    var initial = true;
                    filterStore.get(id).subscribe(isAvailable => {
                        available[id] = isAvailable;
                        if (selected[id]) {
                            (isAvailable ? addToSelection : removeFromSelection)(id);
                            view.trigger();
                        }
                        // Add or subtract the hidden/visible item from numAvailable (only subtract if not initial)
                        const prevNumAvailable = numAvailable;
                        numAvailable = prevNumAvailable + (isAvailable ? 1 : !initial ? -1 : 0);
                        if (prevNumAvailable !== numAvailable) {
                            numAvailableStore.set(numAvailable);
                        }
                        evalCollective();
                        initial = false;
                    });
                }
            }
        }
    }, true);

    const get = id => stores[id];

    const selectAll = () => {
        forOwn(stores, (store, id) => {
            store.set(true)
        });
    }

    const selectNone = () => {
        forOwn(stores, (store, id) => {
            store.set(false)
        });
    }

    const selectOnly = ids => {
        forOwn(stores, (store, id) => {
            store.set(ids.indexOf(id) >= 0);
        });
    }

    return {
        subscribe: view.subscribe,
        get,
        collective: {subscribe: collectiveStore.subscribe},
        numAvailable: {subscribe: numAvailableStore.subscribe},
        selectAll,
        selectNone,
        selectOnly,
        current: selection
    }
}