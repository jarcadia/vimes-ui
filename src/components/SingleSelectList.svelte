<script>
    import { createEventDispatcher } from 'svelte';
    import { writable } from 'svelte/store';
    import { flip } from 'svelte/animate';
    import { quintOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';
    import historical from '../js/historical';

    // import CheckboxListItem from './CheckboxListItem.svelte';
    import map from 'lodash/map';
    import toPairs from 'lodash/toPairs';
    import filter from 'lodash/filter';
    import merge from 'lodash/merge';
    import keys from 'lodash/keys';
    import fromPairs from 'lodash/fromPairs';
    import find from 'lodash/find';
    import each from 'lodash/each';
    import clone from 'lodash/clone';

    import DefaultListItem from './DefaultListItem.svelte';

    export let elements, component = DefaultListItem, selection = writable([]);

    $: available = fromPairs(map(elements, ({id, store}) => [id, true]));

    let selected = {}, previous;
    $: {
        const s = map(filter(toPairs(selected), ([id, store]) => available[id] === true && selected[id] === true), ([id, _]) => id);
        if (s.length == 0) {
            $selection = undefined;
        } else if (s.length == 1) {
            $selection = s[0]; 
        } else if (s.length == 2) {
            $selection = s[0] === previous[0] ? s[1] : s[0];
            selected[previous[0]] = false;
        }
        previous = clone(s);
    }
    $: console.log('Selection', $selection);
</script>

{#each elements as {id, store} (id)}
    <div animate:flip="{{duration: 250, easing: quintOut}}" >
        <svelte:component this={component} id={id} store={store} bind:selected={selected[id]}/>
    </div>
{/each}

<style>
</style>
