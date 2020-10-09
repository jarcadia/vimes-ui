<script>
    import { onMount } from 'svelte';
    import Checkbox from './Checkbox.svelte';
    import Properties from './Properties.svelte';
    import InstanceStateIcon from './InstanceStateIcon.svelte';
    import IconButton from './IconButton3.svelte';
    import Popover from './Popover2.svelte';
    import CircularProgress from './CircularProgress.svelte';

    import {mdiList, mdiSearch} from '../js/icons';

    import keys from 'lodash/keys';
    import sortBy from 'lodash/sortBy';
    import PropertyValue from "./PropertyValue.svelte";

    export let id, store, publish, visible, selected, selectable = true, propsLock;

    $: console.log('Got', $publish);



    let props, propsButton

    $: isDeploying = $store.deploymentState !== undefined && $store.deploymentState !== null;

</script>

 <div class="container" class:visible={$visible} >
    <div class="checkbox-wrapper" class:visible={selectable}>
        <Checkbox bind:checked={$selected} disabled={isDeploying} />
    </div>
    <div class="info" class:shifted-left={!selectable}>
        <InstanceStateIcon state={$store.state}/>
        <div class="name">{id}</div>
    </div>
    <div class="deploy-indicator-wrapper" class:visible={isDeploying}>
        <CircularProgress size=20 color="rgb(0,123,255)"/>
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

    .container:last-child {
        /*box-shadow: inset 0 -1px rgba(100,121,143,0.122);*/
    }

    .checkbox-wrapper {
        margin-right: 10px;
        opacity: 0;
        transform-origin: center left;
        transform: scaleX(0);
        transition-duration: .15s;
        transition-timing-function: ease-in-out;
        transition-property: transform, opacity;
    }

    .checkbox-wrapper.visible {
        transform: scaleX(1);
        opacity: 1;
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

    .props-popover {
        /*border-color: #292b2c;*/
        position: relative;
    }
</style>