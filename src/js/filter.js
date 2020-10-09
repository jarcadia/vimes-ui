// import { writable, derived } from 'svelte/store';

// import forOwn from 'lodash/forOwn'
// import hasIn from 'lodash/hasIn'
// import merge from 'lodash/merge'
// import omit from 'lodash/omit'
// import isEqual from 'lodash/isEqual'

// export default () => {
//     const filter = writable({fields: {}, search: ""});
//     const { subscribe, set, update } = filter;

//     return {
//         subscribe,
//         addField: (field, value) => update(existing => merge({}, existing, {fields : {[field]: value}})),
//         clearField: field => update(existing => ({search: existing.search, fields: omit(existing.fields, field)})),
//         setSearch: search => update(existing => ({fields: existing.fields, search: search})),
//         applyTo: (id, store) => {
//             return derived([filter, store], ([$filter, $store]) => {

//                 var passFields = true;
//                 forOwn($filter.fields, (value, key) => {
//                     if (!hasIn($store, key) || $store[key] != value) {
//                         passFields = false;
//                         return false;
//                     }
//                 });

//                 var passSearch = $filter.search === undefined || $filter.search === "";
//                 if (passFields && !passSearch) {
//                     // First check ID for match
//                     if (id.indexOf($filter.search) !== -1) {
//                         passSearch = true;
//                     } else {
//                         forOwn($store, (value, key) => {
//                             if (isEqual($filter.search, value) ||(typeof value === 'string' && value.indexOf($filter.search) !== -1)) {
//                                 passSearch = true;
//                                 return false;
//                             }
//                         });
//                     }
//                 }
//                 return passFields && passSearch;
//             });
//         }
//     }
// }