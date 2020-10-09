import mergable from '../../src/js/mergable-map2';
import filterStore from '../../src/js/filter-store'
import { writable, get } from 'svelte/store';

import range from 'lodash/range';
import uniq from 'lodash/uniq';
import values from 'lodash/values';
import map from 'lodash/map';
import toPairs from 'lodash/toPairs';

describe('Test mergable store', () => {
    context('mergable-set.js', () => {

        const store = mergable({'dogs/abud': {name: 'Air Bud', age: 5, v:1}});
        const dogs = store.of('dogs');
        const filterParams = writable({});
        const filter = filterStore(dogs, filterParams, (params, id, obj) => {
            console.log('Checking ', obj.name, 'against', params, obj.name.indexOf('Z'), params.searchTerm === undefined);
            return params.searchTerm === undefined ? true : obj.name.indexOf(params.searchTerm) >= 0;
        }); 

        it('initializes properly', () => {
            let count = 0;
            const unsub = filter.get('abud').subscribe(visible => {
                count++;
                expect(visible).to.be.true;
            });
            unsub();
            expect(count).to.equal(1);
        });

        it('updates properly when parameters change', () => {
            let count = 0;
            const unsub = filter.get('abud').subscribe(visible => {
                count++;
                if (count === 1) expect(visible).to.be.true;
                else if (count === 2) expect(visible).to.be.false;
                else if (count === 3) expect(visible).to.be.true;
            });

            filterParams.set({searchTerm: 'A'});
            filterParams.set({searchTerm: 'Ax'});
            filterParams.set({searchTerm: 'Bud'});

            unsub();
            expect(count).to.equal(3);
        });
    });
});