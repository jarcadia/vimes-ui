<!--<script>-->
<!--    export let id, store;-->

<!--</script>-->


<!--<div>-->
<!--    {$store.app} - {$store.version} - {$store.host} - {$store.state}-->
<!--</div>-->


<script>
    import { createEventDispatcher } from 'svelte';
    import CircularProgress from './CircularProgress2.svelte';
    import IconButton from './IconButton3.svelte';

    import { mdiClose } from '../js/icons';

    console.log(mdiClose);

    export let id, store;
    $: host = $store.host;
    $: shortHost = host.substring(0, host.indexOf("."));

    const dispatch = createEventDispatcher();
    function cancel() {
        dispatch('cancel', id);
    }

</script>


<div class="container">
    <div class="title-wrapper">
        <div>{shortHost}</div>
        <div>{$store.app} {$store.version}</div>
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
</style>

