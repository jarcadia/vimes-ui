export default (store, map, property) {

    const view = store.view(map, (lookup, id, values) => {
        if (values === undefined) {
            delete map[id];
        } else {
            map[id] = values[property];
        }
    });

    return {
        subscribe: view.subscribe
    }
}
