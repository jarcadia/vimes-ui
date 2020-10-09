import mergableMap from './mergable-map2';

export default (preload, options = {}) => {
    var socket;
    options.resync = (type, id) => {
        if (socket === undefined) {
            console.error(`Unable to resync for ${type}/${id}. Socket.io not initialized`)
        } else {
            socket.emit('resync', type, id);
        }
    }
    const { of, apply } = mergableMap(preload, options);
    const bindTo = (socketToBind, types = []) => {
        socket = socketToBind;
        socket.on('change', change => apply(change));
        socket.emit('subscribe', types);
    }

    const softDelete = (type, id) => {
        const obj = [];
        obj[type + '/' + id] = null;
        apply(obj);
    }

    return {
        of,
        bindTo,
        softDelete,
    }
}