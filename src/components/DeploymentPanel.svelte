<script>
    import { writable, derived } from 'svelte/store';
    import has from 'lodash/has'
    import map from 'lodash/map'
    import fromPairs from 'lodash/fromPairs'
    import flattened from '../js/flattened.js';

    import subscriptionManager from '../js/subscription-manager';

    import MultiSelectList from './MultiSelectList.svelte';
    import Deployment from './Deployment.svelte';

    export let instanceStore, deploymentStore;

    const stateView = instanceStore.view(['deploymentState']);

    let selection = writable();
    let selectable = false;
    
</script>
<div class="container">

    <MultiSelectList store={deploymentStore}
                     component={Deployment}
                     selection={selection}
                     extras={{instanceStore: instanceStore}}
                     {selectable} />

</div>

<style>
    .container {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 300px;
        height:300px;
        background: white;
    }
</style>
