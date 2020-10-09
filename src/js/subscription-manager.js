export default (object, callback) => {
    const subscribers = [];

    const invoke = () => subscribers.forEach(subscriber => subscriber(object));

    const subscribe = (subscriber) => {
        subscribers.push(subscriber);
        var onDeactivate;
        if (subscribers.length === 1 && callback !== undefined) onDeactivate = callback();
        const unsubscribe = () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1)  subscribers.splice(index, 1);
            if (subscribers.length === 0 && onDeactivate !== undefined) onDeactivate();
        }
        subscriber(object);
        return unsubscribe;
    }

    const asStore = () => ({subscribe: subscribe});

    return {
        subscribe,
        asStore,
        invoke
    }
}