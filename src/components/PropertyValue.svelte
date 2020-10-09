<script>
import Checkbox from './Checkbox.svelte';
import InstanceStateIcon from './InstanceStateIcon.svelte';
import IconButton from './IconButton3.svelte';
import Popover from './Popover.svelte';
import CircularProgress from './CircularProgress.svelte';

import { mdiList, mdiSearch } from '../js/icons';

import keys from 'lodash/keys';
import sortBy from 'lodash/sortBy';

export let type, value, isWritable;
</script>

{#if type == 'Text'}
    <div>{value}</div>
{:else if type == 'Checkbox'}
    <Checkbox checked={value} disabled={!isWritable}/>
{:else if type == 'Integer'}
    <div>{value}</div>
{/if}

<style>
</style>