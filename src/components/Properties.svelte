<script>
import Checkbox from './Checkbox.svelte';
import PropertyValue from './PropertyValue.svelte';
import IconButton from './IconButton3.svelte';
import Popover from './Popover.svelte';
import CircularProgress from './CircularProgress.svelte';

import { mdiList, mdiSearch } from '../js/icons';

import keys from 'lodash/keys';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

export let store, publish;
$: propNames = sortBy(filter(keys(publish), k => k !== 'v'));

</script>

<div class="container">
    <div>
        {#each propNames as propName }
            <div class="row">{publish[propName]['displayName']}</div>
        {/each}
    </div>
    <div>
        {#each propNames as propName }
            <div class="row">
            <PropertyValue type={publish[propName]['type']}
                           value={store[propName]}
                           isWritable={publish[propName]['writable']}/>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;

        /*align-items: center;*/
        /*box-shadow: inset 0 -1px rgba(100,121,143,0.122);*/
        margin: 5px 5px 5px 5px;
        background: white;
    }

    .row {
        box-shadow: inset 0 -1px rgba(100,121,143,0.122);
        padding: 5px 5px 5px 15px;
    }
</style>