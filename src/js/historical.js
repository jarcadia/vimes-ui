// import { writable } from 'svelte/store';

// import each from 'lodash/each';

// export default () => {
//     const valueStore = writable({});
//     const selectionStore = writable();

//     var previous;

//     return {
//         selection: {
//             subscribe: selectionStore.subscribe
//         },
//         subscribe: valueStore.subscribe,
//         set: values => {
//             var selected = undefined;
//             console.log("Searching values, previous is", JSON.stringify(previous));
//             each(values, (value, id) => {
//                 if (value === true && id !== previous) {
//                     console.log("Found", id);
//                     selected = id;
//                     return false;
//                 }
//             });

//             if (previous !== undefined) {
//                 values[previous] = false;
//             }
//             selectionStore.set(selected);
//             previous = selected;

//             valueStore.set(values);
//         }
//     }
// }