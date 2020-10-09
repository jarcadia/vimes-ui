import mergable from '../../src/js/mergable-map2';
import filterStore from '../../src/js/filter-store'
import selectionStore from '../../src/js/selection-store'
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

        const selection = selectionStore(dogs);

        it('initializes properly', () => {
            var count = 0;
            const unsub = selection.subscribe(s => {
                console.log('Invoked', s)
                count++;
                expect(s).to.be.empty;
            });
            unsub();
            expect(count).to.equal(1);
        });

        it('selects an item properly', () => {
            var count = 0;
            const unsub = selection.subscribe(s => {
                count++;
                if (count == 1) expect(s).to.be.empty;
                else if (count == 2) expect(s).to.have.members(['abud']);
            });
            selection.get('abud').set(true);
            unsub();
            expect(count).to.equal(2);
        });

        it('deselects an item properly', () => {
            var count = 0;
            const unsub = selection.subscribe(s => {
                count++;
                if (count == 1) expect(s).to.have.members(['abud']);
                else if (count == 2) expect(s).to.be.empty;
            });
            selection.get('abud').set(false);
            unsub();
            expect(count).to.equal(2);
        });

        it('does not update when an item is added', () => {
            var count = 0;
            const unsub = selection.subscribe(s => {
                count++;
                expect(s).to.be.empty;
            });
            store.apply({'dogs/lassie': {name: 'Lassie', age: 7, v: 1}})
            unsub();
            expect(count).to.equal(1);
        });

        it('selects multiple items', () => {
            var count = 0;
            const unsub = selection.subscribe(s => {
                count++;
                if (count == 1) expect(s).to.be.empty;
                else if (count == 2) expect(s).to.have.members(['abud']);
                else if (count == 2) expect(s).to.have.members(['abud', 'lassie']);
            });
            selection.get('abud').set(true);
            selection.get('lassie').set(true);
            unsub();
            expect(count).to.equal(3);
        });

        it('correctly handles multiple selections/deselections', () => {
            var count = 0;
            const unsub = selection.subscribe(s => {
                count++;
                if (count == 1) expect(s).to.have.members(['abud', 'lassie']);
                else if (count == 2) expect(s).to.have.members(['lassie']);
                else if (count == 3) expect(s).to.have.members(['abud', 'lassie']);
                else if (count == 4) expect(s).to.have.members(['abud']);
                else if (count == 5) expect(s).to.be.empty;
            });

            selection.get('abud').set(false);
            selection.get('abud').set(true);
            selection.get('lassie').set(false);
            selection.get('abud').set(false);

            unsub();
            expect(count).to.equal(5);
        });

    });
});