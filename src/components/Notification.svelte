<script>
import { onMount, createEventDispatcher } from 'svelte';
import moment from 'moment';
import { mdiInfo, mdiWarning, mdiError } from '../js/icons';

import Icon from './Icon.svelte';
import DropdownIcon from './DropdownIcon2.svelte';

const dispatch = createEventDispatcher();

export let id, store;
let visible = true;

$: svg = mdiInfo;

let currentTime = Date.now();
$: millisSince = currentTime - $store.timestamp;
$: timeSince = moment.duration(millisSince).humanize() + ' ago';

let showDetails = false;

const scheduledTimeRefresh = () => {
    console.log('Scheduling with millis', millisSince);

    const delay = millisSince < 60 * 1000           ? 10 * 1000      : /* less than a minute, refresh in 10 seconds */
                  millisSince < 60 * 60 * 1000      ? 60 * 1000      : /* less than an hour, refresh in 1 minute */
                  millisSince < 24 * 60 * 60 * 1000 ? 60 * 10 * 1000 : /* less than a day, refresh in 10 minutes */
                  undefined; /* More than day, don't schedule refresh */

    if (delay !== undefined) {
        setTimeout(() => {
            currentTime = Date.now();
            scheduledTimeRefresh();
        }, delay)
    }
}

onMount(() => {
    scheduledTimeRefresh();
});

function onDropdownIconClick(event) {
    showDetails = !showDetails;
    event.stopPropagation();
}

</script>

{#if visible}
    <div class="container">
        <div class="left-group">
            <div class="level"
                 class:info={$store.level === 'info'}
                 class:warning={$store.level === 'warn'}
                 class:error={$store.level === 'error'}>
                <Icon width=24 {svg} />
            </div>
            <div class="msg">{$store.msg}</div>
        </div>
        <div class="right-group">
            <div class="time-since">{timeSince}</div>
            <svg class="dropdown-icon"
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24"
                 on:click={onDropdownIconClick}
                 class:expanded={showDetails}>
                <path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
            </svg>
        </div>
    </div>
{/if}


<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: inset 0 -1px rgba(100,121,143,0.122);
        padding: 5px 5px 5px 15px;
    }

    .left-group {
        display: flex;
        align-items: center;
        min-width: 0px;
    }

    .right-group {
        display: flex;
        align-items: center;
    }

    .level {
        width: 24px;
        height: 24px;
    }

    .level.info {
        color: rgb(0,123,255);
    }

    .level.warn {
        color: #ffc107;
    }

    .level.error {
        color: #dc3545;
    }

    .msg {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis
    }

    .time-since {
        white-space: nowrap;
    }

    .dropdown-icon {
        cursor: pointer;
        width: 20px;
        height: 20px;
        transition-property: transform;
        transition-duration: .15s;
    }

    .expanded {
        transform: rotate(180deg);
    }
</style>