<script>
import { createEventDispatcher } from 'svelte';
import { writable, derived } from 'svelte/store';
import { slide } from 'svelte/transition';
import { mdiLaunch, mdiRefresh } from '../js/icons';
import MultiSelectList from '../components/MultiSelectList.svelte';
import IconButton from './IconButton3.svelte';
import MultiSelectListCheckboxDropdown from './MultiSelectListCheckboxDropdown.svelte';
import Switch from './Switch.svelte';

import map from 'lodash/map'
import keys from 'lodash/keys'
import values from 'lodash/values'
import uniq from 'lodash/uniq'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'
import concat from 'lodash/concat'
import flatMap from 'lodash/flatMap'
import sortBy from 'lodash/sortBy'

import filtered from '../js/filtered.js';
import flattened from '../js/flattened.js';
import filterStore from '../js/filter-store';

export let store, selection, selectable

const appLookup = store.mappingView((id, values) => values.app)
const grouped = store.groupedView((id, values) => values.app);
const apps = derived(grouped, $grouped => Object.keys($grouped));

console.log('Raw data', grouped.data);

$: selectedApps = uniq(map($selection, id => $appLookup[id]));

$: console.log('Selected Apps', selectedApps);

let listElement;

</script>

<div class="container">
    <div class="header">
        <h3 >Instances</h3>
        <Switch bind:enabled={$selectable}/>
    </div>
    <div class="actions-bar" class:visible={$selectable}>
        <MultiSelectListCheckboxDropdown {grouped} {selection}/>
        <!-- <div class="actions" class:visible={$selection.length > 0}>
            <IconButton width=20 svg={mdiLaunch} on:click={() => dispatch('deploy', {selection: $selection, app: appSelection[0]})}/>
            <IconButton width=20 svg={mdiRefresh} on:click={() => dispatch('restart', {selection: $selection})}/>
        </div> -->
    </div>
    <div class="list-wrapper">
        <slot />
    </div>
</div>



<style>

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 10px;
}

.header h3 {
    font-size: 16px;
    font-weight: normal;
    margin: 0px;
}

.actions-bar {
    display: flex;
    align-items: center;
    height: 0px;
    padding-left: 10px;
    transition-duration: .15s;
    transition-property: transform, opacity, height;
    transition-timing-function: ease-in-out;
    transform-origin: top left;
    transform: scale(1);
    opacity: 0;
    position: relative;
    z-index: 1;
}

.actions-bar:not(.visible) {
    pointer-events: none;
}

.actions-bar.visible {
    height: 31px;
    transform: scale(1);
    opacity: 1;
}

.actions {
    margin-left: 12px;
    transition: transform .15s ease-in-out, opacity .15s ease-in-out;
    transform-origin: top left;
    transform: scaleY(0);
    opacity: 0;
}

.actions.visible {
    transform: scaleY(1);
    opacity: 1;
}

.list-wrapper {
    flex: 1 1 auto;
    overflow-y: auto;
    padding-left: 10px;
    transition: transform .15s ease-in-out;
}

</style>