<script>
    import { createEventDispatcher } from 'svelte';
    import { writable } from 'svelte/store';
    import { flip } from 'svelte/animate';
    import { quintOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';

    import each from 'lodash/each';
    import size from 'lodash/size';
    import map from 'lodash/map';
    import fromPairs from 'lodash/fromPairs';
    import toPairs from 'lodash/toPairs';
    import filter from 'lodash/filter';

    import selectionStore from '../js/selection-store';

    import DefaultListItem from './DefaultListItem.svelte';

    export let store, filterStore, component = DefaultListItem, selection, collectiveState = writable(), selectable = true, extras = {}

    $: available = fromPairs(map($store, id => [id, true]));
    $: numAvailable = size(available);

    // let selected = {}
    // $: $selection = map(filter(toPairs(selected), ([id, store]) => available[id] === true && selected[id] === true), ([id, _]) => id);
    // $: numSelected = size($selection);

    // $: $collectiveState = numSelected == 0 ? 'none' : numSelected == numAvailable ? 'all' : 'partial'

    export function selectOnly(ids) { console.log('Selecting only', ids); each(available, (value, id) => {selected[id] = ids.indexOf(id) >= 0; }); }
    export function selectAll() { each(available, (value, id) => { selected[id] = true; }); }
    export function deselectAll() { each(available, (value, id) => { selected[id] = false; }); }

    // let animateFlip = {duration: 2500, easing: quintOut};
    // let fadeIn = {duration: 2500}

    const animate = false;
    let animateFlip = undefined;
    let fadeIn = undefined;

    $: if ($selection.length > 0 && !selectable) {
        deselectAll();
    }

    $: console.log('Selection', $selection);

</script>

{#if animate}
{:else}
{#each $store as id (id)}
    <svelte:component this={component} {id} store={store.get(id)} selected={selection.get(id)} {selectable} {...extras} />
{/each}
{/if}
<style>

</style>
