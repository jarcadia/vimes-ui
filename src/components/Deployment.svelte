<script>
    import { createEventDispatcher } from 'svelte';
    import { derived } from 'svelte/store';
    import DeploymentInstance from './DeploymentInstance.svelte'
    import DropdownIcon from './DropdownIcon.svelte'
    import LinearProgress from './LinearProgress.svelte';
    import CircularProgress from './CircularProgress2.svelte';
    import IconButton from './IconButton3.svelte';
    import reduce from 'lodash/reduce';

    import { mdiClose } from '../js/icons';

    console.log(mdiClose);

    export let id, store, instanceStore, artifactStore;
    $: isUpgrade = $store.artifact !== undefined && $store.artifact !== null;

    $: instanceIds = $store.instances;
    $: size = instanceIds.length;

    $: title = (isUpgrade ? 'Upgrading ' : 'Restarting ') + $store.label;
    $: numInstancesStr = `${size} instance${size === 1 ? '' : 's'}`;

    $: version = isUpgrade ? $store.version : undefined;

    let expanded = false;

    const dispatch = createEventDispatcher();
    function cancel() {
        dispatch('cancel', id);
    }

    function dropdownClicked() {
        expanded = !expanded;
    }
</script>


<div class="container">
    <div class="title-wrapper">
        <div class="title">{title}</div>
        <div class="subtitle">
            <span>{version}</span>
            <span class="dropdown-icon-wrapper" on:click={dropdownClicked}> <DropdownIcon {expanded} /> </span>
        </div>
        <div class="instance-wrapper" class:visible={expanded}>
            {#each instanceIds as instanceId}
                <DeploymentInstance id={instanceId} store={instanceStore.get(instanceId)}/>
            {/each}
        </div>
    </div>
    <div class="progress-wrapper">
        <CircularProgress percent={$store.progress}/>
    </div>
    <div class="actions-wrapper">
        <IconButton svg={mdiClose} on:click={cancel}/>
    </div>
</div>

<style>
    .container {
        padding-bottom: 8px;
        padding-right: 5px;
        padding-left: 20px;
        box-shadow: inset 0 -1px rgba(100,121,143,0.122);
        display: flex;
    }

    .progress-wrapper {
        display: flex;
        align-items: center;
        padding-right: 10px;
    }

    .actions-wrapper {
        display: flex;
        align-items: center;
    }

    .title-wrapper {
        flex-grow: 1;
    }

    .title {
        font-size: 16px;
    }

    .subtitle {
        display: flex;
        margin-top: 3px;
    }

    .instance-wrapper {
        font-size: 13px;
        padding-left: 10px;
    }

    .instance-wrapper:not(.visible) {
        display: none;
    }

    .dropdown-icon-wrapper {
        margin-left: 4px;
        padding-left: 2px;
        padding-right: 2px;
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

