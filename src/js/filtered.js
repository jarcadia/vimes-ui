import { writable, derived } from 'svelte/store';
import { tick } from 'svelte';

import flattened from './flattened';

import forEach from 'lodash/forEach'
import each from 'lodash/each'
import forOwn from 'lodash/forOwn'
import map from 'lodash/map'
import hasIn from 'lodash/hasIn'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import fromPairs from 'lodash/fromPairs'
import keys from 'lodash/keys'
import remove from 'lodash/remove'
import filter from 'lodash/filter'





  // var passFields = true;
  //       forOwn(fields, (value, key) => {
  //           // console.log('Testing', id, 'against', JSON.stringify(fields));
  //           if (!hasIn(data, key) || !isEqual(data[key], value)) {
  //               passFields = false;
  //               return false;
  //           }
  //       });

  //       var passSearch = search === undefined || search === "";
  //       if (passFields && !passSearch) {
  //           // console.log('Testing', id, 'against', JSON.stringify(search));
  //           // First check ID for match
  //           if (id.indexOf(search) !== -1) {
  //               passSearch = true;
  //           } else {
  //               forOwn(data, (value, key) => {
  //                   if (isEqual(search, value) ||(typeof value === 'string' && value.indexOf(search) !== -1)) {
  //                       passSearch = true;
  //                       return false;
  //                   }
  //               });
  //           }
  //       }

  //       // console.log('Returning', passFields && passSearch)
  //       return passFields && passSearch;


  // ideas
// Make flattened function a store
// Do we really need to create a new function? Or will predicate see the changes made to the filtered object







export default (root, predicate, initial = {}) => {
    var params = initial;
    const createFilterFunc = () => (id, data) => predicate(params, id, data);
    const passPredicateStore = flattened(root, createFilterFunc(initial));

    const filteredElements = derived([root, passPredicateStore], ([$root, $pass]) => {
        if ($pass === undefined || isEmpty($pass)) {
            return $root;
        } else {
            console.log('Updating filter');
            return filter($root, ({id, store}) => $pass[id]);
        }
    });

    const paramSubscribers = [];
    return {
        subscribe: filteredElements.subscribe,
        params: {
            subscribe: subscription => {
                paramSubscribers.push(subscription);
                subscription(params);
                return () => {}
            },
            set: p => {
                merge(params, p)
                console.log('Setting filter params');
                passPredicateStore.iteratee.set(createFilterFunc());
                each(paramSubscribers, subscription => {
                    subscription(params);
                });
            }
        }
    }
}