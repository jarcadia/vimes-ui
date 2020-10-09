import { writable } from 'svelte/store';
import forOwn from 'lodash/forOwn';
import keys from 'lodash/keys';
import has from 'lodash/has';
import sortedIndex from 'lodash/sortedIndex';
import sortedIndexBy from 'lodash/sortedIndexBy';
import pull from 'lodash/pull';

import subscriptionManager from './subscription-manager';


export default (preload, options) => {
    const requestResync = options.resync || (() => console.error("Resync not implemented"));
    const sort = options.sort || {};
    const chunking = options.chunking || {}

    const ids = {}
    const idSubscriptions = {};

    const data = {};
    const dataSubscriptions = {};

    const views = {};

    const sortFunc = sort;

    const parsePath = path => {
        const idx = path.indexOf('/');
        if (idx === -1) {
            throw new Error('Provided path (' + path + ') does not include type');
        } else if (idx === 0) {
            throw new Error('Provided path (' + path + ') must have a valid type');
        }
        return { type: path.substring(0, idx), id : path.substring(idx+1)};
    }

    const getTypeSpecifics = type => {
        if (!has(data, type)) {
            data[type] = {};
            dataSubscriptions[type] = {};
            ids[type] = [];
            idSubscriptions[type] = subscriptionManager(ids[type]);
            views[type] = [];
        }

        return {
            typeData: data[type],
            typeDataManagers: dataSubscriptions[type],
            typeIds: ids[type],
            typeIdManager: idSubscriptions[type],
            typeViews: views[type],
            typeSortFunc: sortFunc[type]
        }
    }

    const createIndexStoreRef = (type, apply) => {

        if (type === undefined || type === null || type.length === 0) {
            throw new Error('Type must be defined')
        }

        const { typeData, typeDataManagers, typeIds, typeIdManager, typeViews, typeSortFunc } = getTypeSpecifics(type);

        const createView = (object, iteratee, autoSubscribe = false) => {
            const viewObj = object;
            const update = (id, markDirty) => {
                const changed = iteratee(viewObj, id, typeData[id]);
                if (changed && markDirty !== undefined) markDirty(manager);
            }

            const onFirstSubscriber = () => {
                typeIds.forEach(id => update(id));
                typeViews.push(update);
                const unsubscribe = () => {
                    const index = typeViews.indexOf(update);
                    if (index !== -1) typeViews.splice(index, 1);
                }
                return unsubscribe;
            }

            const manager = subscriptionManager(viewObj, onFirstSubscriber);
            if (autoSubscribe) onFirstSubscriber();

            return {
                subscribe: manager.subscribe,
                trigger: manager.invoke
            }
        }

        const createMappingView = iteratee => {
            const map = {};
            const view = createView(map, (_, id, values) => {
                if (values === undefined) {
                    delete map[id];
                    return true;
                } else {
                    const prev = map[id];
                    map[id] = iteratee(id, values);
                    return prev !== map[id];
                }
            });
            return {
                data: map,
                subscribe: view.subscribe
            }
        }

        const createGroupedView = iteratee => {
            const cache = {};
            const groups = {}

            const add = (group, id) => {
                if (!(group in groups)) {
                    groups[group] = [];
                }
                groups[group].splice(sortedIndex(groups[group], id), 0, id)
            }
            const remove = (group, id)=> groups[group].splice(sortedIndex(groups[group], id), 1);

            const view = createView(groups, (_, id, values) => {
                if (values === undefined) {
                    remove(cache[id], id);
                    delete cache[id];
                    return true;
                } else {
                    const group = iteratee(id, values);
                    if (group !== cache[id]) {
                        if (cache[id] !== undefined) {
                            remove(cache[id], id);
                        }
                        add(group, id);
                        cache[id] = group;
                        return true;
                    }
                }
            }, true);
            return {
                data: groups,
                subscribe: view.subscribe
            }
        }

        const loadNextChunk = chunking[type] !== undefined ? () => {
            // Get the last object in the current data
            const lastId = typeIds.length === 0 ? undefined : typeIds[typeIds.length - 1];
            const last = lastId === undefined ? undefined : typeData[lastId];

            console.log('Loading next chunk from', lastId, last);
            Promise.resolve(chunking[type](lastId, last)).then(values => {
                const update = values || {};
                apply(update);
            });
        } : () => console.error(`Chunking not enabled for ${type}`);

        return {
            subscribe: typeIdManager.asStore().subscribe,
            get: id => {
                let manager = typeDataManagers[id];
                if (manager === undefined && id.indexOf(type) == 0) {
                    // Remove type prefix from path
                    id = id.substring(type.length + 1);
                    manager = typeDataManagers[id];
                }
                if (manager !== undefined) {
                    return manager.asStore();
                } else {
                    throw `ID ${type}/${id} does not exist`
                }
            },
            view: createView,
            mappingView:  createMappingView,
            groupedView: createGroupedView,
            loadNextChunk
        }
    }

    const apply = updates => {
        const dirtied = new Set();

        forOwn(updates, (values, path) => {
            const { type, id } = parsePath(path);
            const { typeData, typeDataManagers, typeIds, typeIdManager, typeViews, typeSortFunc } = getTypeSpecifics(type);
            // console.debug('Processing change to', path, values);

            var shouldUpdateViews = false;
            if ((values === null || values === undefined) && typeData[id] !== undefined) {
                // Delete from ID caches
                pull(typeIds, id);
                dirtied.add(typeIdManager);

                // Delete from set data
                const deleted = typeData[id];
                delete typeData[id];
                delete typeDataManagers[id];

                shouldUpdateViews = true;
            } else if (typeData[id] === undefined) {        // Han
                /* Handle insertions */

                // Add to type data cache
                typeData[id] = values;
                typeDataManagers[id] = subscriptionManager(typeData[id]);

                // Determine where to insert the ID
                const targetIndex = typeSortFunc === undefined ? sortedIndex(typeIds, id) :
                    sortedIndexBy(typeIds, id, id => typeSortFunc(typeData[id]));
                typeIds.splice(targetIndex, 0, id);
                // console.debug('Inserting', path, targetIndex, values);

                // Flag to trigger subscribers
                dirtied.add(typeIdManager);
                dirtied.add(typeDataManagers[id]);
                shouldUpdateViews = true;
            } else {
                // Handle updates
                const existing = typeData[id];
                if (values.v === existing.v + 1 || values.isResync === true) {
                    // console.debug('Applying version', values.v, values.isResync === true ? '(resync)' : '');
                    forOwn(values, (value, field) => {
                        if (value === null) {
                            delete existing[field]
                        } else {
                            existing[field] = value;
                        }
                    });
                    dirtied.add(typeDataManagers[id]);
                    shouldUpdateViews = true;
                } else {
                    if (values.v === existing.v) {
                        console.log('Ignoring duplicate')
                    } else {
                        console.debug(`Requesting resync for ${path} since version ${values.v} was not expected (currently ${existing.v})`);
                        requestResync(type, id);
                    }
                }
            }

            if (shouldUpdateViews) {
                typeViews.forEach(updateFunc => updateFunc(id, manager => dirtied.add(manager)));
            }

        });
        dirtied.forEach(subManager => subManager.invoke());
    }

    apply(preload);
    return {
        of: type => createIndexStoreRef(type, apply),
        apply,
    }
}
