export default () => {
    const subscribers = [];
    return {
        subscribe: (subscriber) => {
            subscribers.push(subscriber);
            subscriber(values);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            }
        },
        source: (obj) => {
            console.log('Sourcing view from ', obj);
            subscribers.forEach(subscriber => subscriber(obj));
        }
    }
}
