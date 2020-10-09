import mergable from '../../src/js/mergable-map2';
import { get } from 'svelte/store';
import range from 'lodash/range';
import uniq from 'lodash/uniq';
import values from 'lodash/values';
import map from 'lodash/map';
import toPairs from 'lodash/toPairs';
import sortBy from 'lodash/sortBy';

describe('Test mergable store', () => {
    context('mergable-set.js', () => {

        const database = {};
        let applyRef = undefined;
        const resyncFunc = (type, id) => {
            setTimeout(() => {
                const path = type + '/' + id;
                const update = {};
                update[path] = database[path];
                update[path]['isResync'] = true;
                console.debug('Simulating resync for', path, update);
                applyRef(update);
            });
        }

        const sort = {
            'shapes': s => {
                console.debug('Invoking sort function for shapes on ', s);
                return s.sides;
            },
            'events':  e => e.position
        }

        // const eventData = {
        //     'events/alpha': { position: 0 },
        //     'events/beta': { position: 1},
        //     'events/charlie': { position: 2},
        //     'events/delta': { position: 3},
        //     'events/echo': { position: 4},
        //     'events/foxtrot': { position: 5},
        // }


        const chunking = {
            'events': (id, val) => {
                return new Promise((resolve, reject) => {
                    const update = id === 'beta' ? {
                        'events/beta': {position: 1},
                        'events/charlie': {position: 2},
                        'events/delta': {position: 3},
                    } : id === 'delta' ? {
                        'events/delta': {position: 3},
                        'events/echo': { position: 4},
                        'events/foxtrot': { position: 5},
                    } : undefined;
                    setTimeout(() => {
                        resolve(update);
                    }, 500);
                });
            }
        }

        const preload = {
            'dogs/abud': { name: 'Air Bud', age: 5, v:1 },
            'events/alpha': { position: 0 },
            'events/beta': { position: 1}
        }

        const store = mergable(preload, {
            'resync': resyncFunc,
            'sort': sort,
            'chunking': chunking
        })

        const people = store.of('people');
        const dogs = store.of('dogs');
        const shapes = store.of('shapes');
        const events = store.of('events');

        // Set applyRef to store's apply function now that it is created
        applyRef = store.apply;

        it('initializes properly', () => {
            const unsub1 = people.subscribe(ids => {
                expect(ids).to.deep.equal([]);
            });

            const unsub2 = dogs.subscribe(ids => {
                expect(ids).to.deep.equal(['abud']);
            })
            unsub1();
            unsub2();
        });

        it('inserts an object properly', () => {
            const johnDoe = { name: 'John Doe', age: 33, v: 3};

            var count = 0;
            const unsub1 = people.subscribe(ids => {
                count++;
                if (count == 1) {
                    expect(ids).to.deep.equal([]);
                } else if (count == 2) {
                    expect(ids).to.deep.equal(['jdoe']);
                } else {
                    expect.fail('Store should not be updated')
                }
            });

            store.apply({'people/jdoe': johnDoe});

            const unsub2 = people.get('jdoe').subscribe(d => {
                expect(d).to.equal(johnDoe);
            });

            unsub1();
            unsub2();
        });

        it('applies a simple update to an existing object', () => {

            var idCount = 0;
            const unsub1 = people.subscribe(ids => {
                idCount++;
                if (idCount == 1) {
                    expect(ids).to.deep.equal(['jdoe']);
                }
            });

            var count = 0;
            const unsub2 = people.get('jdoe').subscribe(johnDoe => {
                count++;
                if (count == 1) {
                    expect(johnDoe.age).to.equal(33);
                } else {
                    expect(johnDoe.age).to.equal(34);
                }
            });
            store.apply({'people/jdoe': {age: 34, v:4}});

            unsub1();
            unsub2();
            expect(idCount).to.equal(1);
            expect(count).to.equal(2);
        });

        it('applies an update with a new item', () => {
            const aliceSmith = {name: 'Alice Smith', age: 32, v:1};

            var count = 0;
            const unsub1 = people.subscribe(ids => {
                count++;
                if (count == 1) {
                    expect(ids).to.deep.equal(['jdoe']);
                } else if (count == 2) {
                    expect(ids).to.deep.equal(['asmith', 'jdoe']);
                }
            });

            store.apply({'people/asmith': aliceSmith});

            const unsub2 = people.get('asmith').subscribe(obj => {
                expect(obj).to.equal(aliceSmith);
            });

            unsub1();
            unsub2();
        });

        it('sorts items using custom sort function', () => {
            const line = {sides: 2, v: 1};
            const triangle = {sides: 3, v: 1};
            const square = {sides: 4, v: 1};
            const pentagon = {sides: 5, v: 1};
            const hexagon = {sides: 6, v: 1};

            let count = 0;
            const unsub1 = shapes.subscribe(ids => {
                count++;
                if (count == 1) {
                    expect(ids).to.deep.equal([]);
                } else if (count == 2) {
                    expect(ids).to.deep.equal(['pentagon']);
                } else if (count == 3) {
                    expect(ids).to.deep.equal(['line', 'pentagon']);
                } else if (count == 4) {
                    expect(ids).to.deep.equal(['line', 'square', 'pentagon']);
                } else if (count == 5) {
                    expect(ids).to.deep.equal(['line', 'triangle', 'square', 'pentagon']);
                } else if (count == 6) {
                    expect(ids).to.deep.equal(['line', 'triangle', 'square', 'pentagon', 'hexagon']);
                }
            });

            store.apply({'shapes/pentagon': pentagon});
            store.apply({'shapes/line': line});
            store.apply({'shapes/square': square});
            store.apply({'shapes/triangle': triangle});
            store.apply({'shapes/hexagon': hexagon});

            expect(count).to.equal(6);

            unsub1();
        })

        it('properly updates a view when an included field is changed', () => {

            const view = people.view({}, (lookup, id, values) => {
                console.log('Iteratee invoked', id, values);
                lookup[id] = values.age;
                return true;
            });

            var count = 0;
            const unsub = view.subscribe(data => {
                console.log('Age view subscription invoked with', data);
                count ++;
                if (count == 1) {
                    expect(data).to.deep.equal({asmith: 32, jdoe: 34});
                } else if (count == 2) {
                    expect(data).to.deep.equal({asmith: 32, jdoe: 35});
                }
            });

            store.apply({'people/jdoe': {age: 35, v:5}});

            expect(count).to.equal(2);

            unsub();
        });

        it('properly updates a view when an object is inserted', () => {
            const avg = runningAverage();
            const view = people.view(avg, (obj, id, values) => {
                return avg.apply(id, values.age);
            });

            var count = 0;
            const unsub = view.subscribe(avg => {
                count++;
                if (count == 1) {
                    expect(avg.get()).to.equal(33.5);
                } else if (count == 2) {
                    expect(avg.get()).to.equal(35);
                }
            });

            store.apply({'people/bjohnson': {name: 'Bob Johnson', age: 38, v:1}});
            expect(count).to.equal(2);
            unsub();
        });

        it('properly updates a view when an object is deleted', () => {
            const avg = runningAverage();
            const view = people.view(avg, (obj, id, values) => {
                return avg.apply(id, values === undefined ? undefined : values.age);
            });

            var count = 0;
            const unsub = view.subscribe(avg => {
                count ++;
                if (count == 1) {
                    expect(avg.get()).to.equal(35);
                } else if (count == 2) {
                    expect(avg.get()).to.equal(33.5);
                }
            });

            store.apply({'people/bjohnson': null});
            expect(count).to.equal(2);
            unsub();
        });

        it('resyncs when an unexpected version is received', () => {

            store.apply({'people/jdoe': {name: 'John Smith', v:6}});

            var count = 0;
            const promise = new Promise((resolve, reject) => {
                const unsub = people.get('jdoe').subscribe(data => {
                    count++;
                    if (count == 1) {
                        expect(data.name).to.equal('John Smith');
                        expect(data.age).to.equal(35);
                    } else {
                        expect(data.name).to.equal('John Doe');
                        expect(data.age).to.equal(36);
                        unsub();
                        resolve();
                    }
                });

            });

            database['people/jdoe'] =  {name: 'John Doe', age: 36, v:8};
            store.apply({'people/jdoe': {age: 36, v:8}});

            return promise.then(() => {
                expect(count).to.equal(2);
            });
        });

        it('loads next chunk properly', () => {

            var count = 0;
            const promise = new Promise((resolve, reject) => {
                const unsub = events.subscribe(ids => {
                    count++;
                    if (count == 1) {
                        expect(ids).to.deep.equal(['alpha', 'beta']);
                    } else if (count == 2) {
                        expect(ids).to.deep.equal(['alpha', 'beta', 'charlie', 'delta']);
                    } else {
                        expect(ids).to.deep.equal(['alpha', 'beta', 'charlie', 'delta', 'echo', 'foxtrot']);
                        unsub();
                        resolve();
                    }
                    events.loadNextChunk();
                });
            });


            return promise.then(() => {
                expect(count).to.equal(3);
            });
        });
    });

    const runningAverage = () => {
        const prev = {};
        let sum = 0;
        let count = 0;
        const apply = (id, value) => {
            console.log('Updating with', value);
            const before = prev[id];
            prev[id] = value;
            if (before === undefined) {
                count++;
                sum+=value;
                return true;
            } else if (value === undefined) {
                count--;
                sum-=before;
                return true;
            } else if (before !== value) {
                sum-=before;
                sum+=value
                return true;
            } else {
                return true;
            }
        }
        const get = () => sum / count;
        return {
            apply,
            get
        }
    }
});