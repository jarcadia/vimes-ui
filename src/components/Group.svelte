<script>
import Checkbox from './Checkbox.svelte';
import GroupStateIcon from './GroupStateIcon.svelte';
import AlarmIcon from './AlarmIcon.svelte';
import IconButton from './IconButton3.svelte';
import Properties from './Properties.svelte';
import Popover from './Popover2.svelte';

import { mdiList, mdiSearch } from '../js/icons';

import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy'
import sortBy from 'lodash/sortBy';
import size from 'lodash/size';
import toPairs from 'lodash/toPairs';
import groupBy from 'lodash/size';
import reduce from 'lodash/reduce';
import has from 'lodash/has';

export let id, store, publish, visible, selected, selectable = true;
$: isDeploying = $store.deployment !== undefined;

let propsButton;

// $: alarms = pickBy($store, (value, key) => key.startsWith('alarm.'));


$: alarms = reduce($store, (agg, value, key) =>  {
    if (key.startsWith('alarm.')) {
        if (has(agg, value)) {
            agg[value].push(key);
        } else {
            agg[value] = [key];
        }
    }
    return agg;
}, {});

$: maxLevel = has(alarms, 'PANIC') ? 'PANIC' :
    has(alarms, 'CRITICAL') ? 'CRITICAL' :
    has(alarms, 'WARN') ? 'WARN' :
    has(alarms, 'ATTENTION') ? 'ATTENTION' : undefined;

$: console.log('Alarms', alarms, maxLevel);

</script>

 <div class="container" class:visible={$visible} >
    <div class="selectable-wrapper" class:visible={selectable}>
        <div class="checkbox-wrapper" class:visible={!isDeploying}>
            <Checkbox bind:checked={$selected}/>
        </div>
        <div class="deploy-indicator-wrapper" class:visible={isDeploying}>X</div>
    </div>
     <div class="info" class:shifted-left={!selectable}>
         <GroupStateIcon state={$store.state}/>
         <div class="name">{id}</div>
         <AlarmIcon alarms={alarms} />
     </div>
     <div class="actions" >
         <IconButton bind:this={propsButton} svg={mdiList}/>
         <Popover target={() => propsButton.el()}
                  placement="right"
                  arrow="true"
                  duration={[0, 0]}
                  distance="7">
             <Properties store={$store} publish={$publish} />
         </Popover>
         <IconButton svg={mdiSearch} />
     </div>
</div>


<style>
    .container {
        display: none;
        align-items: center;
        box-shadow: inset 0 -1px rgba(100,121,143,0.122);
        padding: 5px 5px 5px 15px;
    }

    .container.visible {
        display: flex;
    }

    .selectable-wrapper {
        margin-right: 10px;
        opacity: 0;
        transform-origin: center left;
        transform: scaleX(0);
        transition-duration: .15s;
        transition-timing-function: ease-in-out;
        transition-property: transform, opacity;
    }

    .selectable-wrapper.visible {
        transform: scaleX(1);
        opacity: 1;
    }

    .checkbox-wrapper:not(.visible) {
        display: none;
    }

    .deploy-indicator-wrapper:not(.visible) {
        display: none;
    }

    .info {
        flex-grow: 1;
        align-self: stretch;
        display: flex;
        align-items: center;
        transition-duration: .15s;
        transition-timing-function: ease-in-out;
        transition-property: transform;
    }

    .info.shifted-left {
        transform: translateX(-26px);
    }

    .name {
        margin-left: 8px;
    }

    .container:not(:hover) .actions {
        visibility: hidden;
    }
</style>