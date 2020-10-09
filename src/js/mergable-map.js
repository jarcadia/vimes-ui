// import { writable } from 'svelte/store';
// import mergable from './mergable';
// import forOwn from 'lodash/forOwn';
// import keys from 'lodash/keys';
// import has from 'lodash/has';
//
// export default (resyncFunc) => {
//     const { subscribe, set } = writable([]);
//     const map = {};
//
//     return {
//         subscribe,
//         get: id => map[id],
//         apply: (update) => {
//             var modified = false;
//             const promises = [];
//             forOwn(update, (obj, id) => {
//                 const existingStore = map[id];
//                 if ((obj === null || obj === undefined) && existingStore !== undefined) {
//                     // Handle deletions
//                     delete map[id];
//                     modified = true;
//                 } else if (existingStore === undefined) {
//                     // Handle creations
//                     map[id] = mergable(id, obj, resyncFunc);
//                     modified = true;
//                 } else {
//                     // Handle updates
//                     promises.push(existingStore.apply(obj));
//                 }
//             });
//             if (modified) {
//                 set(keys(map).sort().map(id => ({id: id, store: map[id]})));
//             }
//             return Promise.all(promises);
//         }
//     }
// }
