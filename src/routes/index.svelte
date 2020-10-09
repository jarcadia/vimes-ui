<svelte:head>
    <title>Sapper project template</title>
</svelte:head>
<script context="module">
import rcommandoPreload from '../js/redis-commando-sapper-preload';
export async function preload(page, params, query) {
    const preload = await rcommandoPreload(this.fetch, ['instance', 'group', 'artifact',
        'deployment', 'distribution', 'publish', {type: "notifications", dataLayout: "timeSeries", limit: 100}]);
    console.log('Preloaded Notifications:', preload.data.notifications)
    return {'preload': preload};
}
</script>
<script>
import { onMount } from 'svelte';
import { writable, derived } from 'svelte/store';
import createStore from '../js/redis-commando-svelte-store'
import io from 'socket.io-client';
import Modal from '../components/Modal.svelte';
// import List from '../components/List.svelte';
import MonitoredList from '../components/MonitoredList.svelte';
import MultiSelectListCheckboxDropdown from '../components/MultiSelectListCheckboxDropdown.svelte';
import MultiSelectList from '../components/MultiSelectList.svelte';
import SingleSelectList from '../components/SingleSelectList.svelte';
import MenuBar from '../components/MenuBar.svelte';
import Instance from '../components/Instance.svelte';
import Group from '../components/Group.svelte';
import Artifact from '../components/Artifact.svelte';
import Deployment from '../components/Deployment.svelte';
import Distribution from '../components/Distribution.svelte';
import Notification from '../components/Notification.svelte';
import IconButton from '../components/IconButton3.svelte';
import Switch from '../components/Switch.svelte';
import TextField from '../components/TextField.svelte';
import ArtifactSelectionModal from '../components/ArtifactSelectionModal.svelte';
import TextButton from '../components/TextButton.svelte';
import CircularProgress from '../components/CircularProgress2.svelte';

import { mdiList, mdiSearch } from '../js/icons';

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
import flatten from 'lodash/flatten'
import mapValues from 'lodash/mapValues'

import { searchTerm } from '../js/stores';
import filtered from '../js/filtered.js';
import filterStore from '../js/filter-store.js';
import selectionStore from '../js/selection-store.js';

import { mdiLaunch, mdiRefresh } from '../js/icons';


import { mdiFindReplace } from '../js/icons';

export let preload;
let store = createStore(preload.data, {
    "sort": {
        "notifications": n => -n.timestamp
    }
});

let socket;
onMount(() => {
    socket = io();
    store.bindTo(socket, preload.types);

    socket.on('disconnect', function() {
        console.log('I am disconnected')
    });

    socket.on('reconnect', function() {
        console.log('I am reconnected')
    })
});

const filterParams = derived([searchTerm], ([$searchTerm]) => ({
    searchTerm: $searchTerm
}));


// Only allow one props popup to be active at once
let propsLock = false;

// Setup Publish store
const publish = store.of('publish')

// Setup Instance stores
const instances = store.of('instance');
const instanceAppLookup = instances.mappingView((id, values) => values.app)
const instancesByApp = instances.groupedView((id, values) => values.app);
const instanceSearchTerm = writable(undefined);
const instanceFilter = filterStore(instances, instanceSearchTerm, (searchTerm, id, obj) => {
    return searchTerm === undefined || searchTerm === '' ? true : id.indexOf(searchTerm) >= 0;
}); 
const instanceSelectable = writable(false);
const instanceSelection = selectionStore(instances, instanceFilter);
const instanceAppSelection = derived([instanceSelection, instanceAppLookup], ([$selection, $lookup]) => {
    const apps = $selection.map(id => $lookup[id]);
    return apps.length == 1 ? apps[0] : undefined;
});

// Setup Group stores
const groups = store.of('group');
const groupAppLookup = groups.mappingView((id, values) => values.app)
const groupsByApp = groups.groupedView((id, values) => values.app);
const groupSearchTerm = writable(undefined);
const groupInstanceLookup = groups.mappingView((id, values) => values.instances);
const groupFilter = filterStore(groups, groupSearchTerm, (searchTerm, id, obj) => {
    return searchTerm === undefined || searchTerm === '' ? true : id.indexOf(searchTerm) >= 0;
}); 
const groupSelectable = writable(false);
const groupSelection = selectionStore(groups, groupFilter);
const groupAppSelection = derived([groupSelection, groupAppLookup], ([$selection, $lookup]) => {
    const apps = uniq($selection.map(id => $lookup[id]));
    return apps.length == 1 ? apps[0] : undefined;
});

// Only allow one deployable selection to be enabled at a time
instanceSelectable.subscribe(enabled => { 
    if (enabled) {
        groupSelectable.set(false);
        groupSelection.selectNone();
    }
});
groupSelectable.subscribe(enabled => {
    if (enabled) {
        instanceSelectable.set(false);
        instanceSelection.selectNone();
    }
});

// Track which deployable section is currently active
const activeSection = derived([instanceSelectable, groupSelectable], ([i, g]) => i === false && g === false ? undefined : i === true ? 'instance' : 'group');

function discover() {
    console.log('Requesting instance discovery')
    socket.emit('discover.instances');
}

function discoverArtifacts() {
    console.log('Requesting artifact discovery')
    socket.emit('discover.artifacts');
}

// Setup Artifact stores
const artifacts = store.of('artifact');
const selectedApp = derived([activeSection, instanceAppSelection, groupAppSelection],
    ([active, instanceApp, groupApp]) => active === 'instance' ? instanceApp : groupApp);
const selectableArtifacts = filterStore(artifacts, selectedApp,
    (selected, id, obj) => selected === undefined ? false : obj.app === selected);
const artifactSelection = selectionStore(artifacts, selectableArtifacts, true);
const numAvailableArtifacts = artifactSelection.numAvailable;

// Setup Artifact Modal and deploy/restart functions
let artifactModal;
function selectArtifact(event) {
    artifactModal.show();
}

function deploy() {
    const targetArtifact = 'artifact:' + $artifactSelection[0];
    const targetInstances = $activeSection === 'instance' ? $instanceSelection.map(inst => 'instance/' + inst) : flatten($groupSelection.map(g => $groupInstanceLookup[g]));

    const taskData = {
        artifact: targetArtifact,
        instances: targetInstances
    }
    console.log('Deploying', taskData);
    socket.emit('deploy.artifact', taskData);
}

function restart() {
    const targetInstances = $activeSection === 'instance' ? $instanceSelection.map(inst => 'instance/' + inst) : flatten($groupSelection.map(g => $groupInstanceLookup[g]));
    console.log('Restarting', targetInstances);
    socket.emit('deploy.restart', {instances: targetInstances});
    instanceSelection.selectNone();
    groupSelection.selectNone();
}

let deploymentsExpanded = true, distributionsExpanded = true;
const deployments = store.of('deployment');
const distributions = store.of('distribution');

function deploymentCanceled(event) {
    console.log('Canceling deployment', event.detail);
    const deploymentId = event.detail;
    socket.emit('deploy.cancel.deployment', 'deployment/' + deploymentId);
}

const notifications = store.of('notifications');
$: console.log($notifications);

function notificationDismissed(event) {
    console.log("Notification " + event.detail.id + " dismissed ");
    store.softDelete("notification", event.detail.id);
}

</script>

<!--<IconButton svg={mdiSearch} />-->
<!--<CircularProgress />-->
<!--<TextButton />-->
<div class="container">
    <div class="section">
        <div class="list-container">
            <div class="list-header">
                <div class="list-title">
                    <div style="display: flex; align-items: center">
                        <h3 style="margin-right: 5px">Instances</h3>
                        <IconButton svg={mdiFindReplace} on:click={discover}/>
                    </div>
                    <Switch bind:enabled={$instanceSelectable}/>
                </div>
                <div class="list-toolbar">
                    <div class="checkbox-dropdown-wrapper" class:visible={$instanceSelectable}>
                        <MultiSelectListCheckboxDropdown grouped={instancesByApp} selection={instanceSelection}/>
                    </div>
                    <div class="list-search-field">
                        <TextField bind:value={$instanceSearchTerm} />
                    </div>
                    <div class="list-actions-wrapper" class:visible={$instanceSelectable && $instanceSelection.length > 0}>
                        <div class="list-actions-inner-wrapper">
                            <IconButton width=20 svg={mdiLaunch} disabled={$numAvailableArtifacts === 0} on:click={selectArtifact}/>
                            <IconButton width=20 svg={mdiRefresh} on:click={restart}/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list-items-wrapper">
                {#each $instances as id (id)}
                <Instance {id}
                          store={instances.get(id)}
                          publish={publish.get('instance.' + $instanceAppLookup[id])}
                          visible={instanceFilter.get(id)}
                          selected={instanceSelection.get(id)}
                          selectable={$instanceSelectable}
                          bind:propsLock={propsLock}/>
                {/each}
            </div>
        </div>
    </div>
    <div class="section">
        <div class="list-container">

<!--            <div class="list-title">-->
<!--                <h3 >Groups</h3>-->
<!--                <Switch bind:enabled={$groupSelectable}/>-->
<!--            </div>-->
<!--            <div class="list-actions-bar" class:visible={$groupSelectable}>-->
<!--                <MultiSelectListCheckboxDropdown grouped={groupsByApp} selection={groupSelection}/>-->
<!--                <div class="list-action-bar-actions" class:visible={$groupSelectable && $groupSelection.length > 0}>-->
<!--                    <IconButton width=20 svg={mdiLaunch} disabled={$numAvailableArtifacts === 0} on:click={selectArtifact}/>-->
<!--                    <IconButton width=20 svg={mdiRefresh} on:click={restart}/>-->
<!--                </div>-->
<!--            </div>-->

            <div class="list-header">
                <div class="list-title">
                    <h3>Groups</h3>
                    <Switch bind:enabled={$groupSelectable}/>
                </div>
                <div class="list-toolbar">
                    <div class="checkbox-dropdown-wrapper" class:visible={$groupSelectable}>
                        <MultiSelectListCheckboxDropdown grouped={groupsByApp} selection={groupSelection}/>
                    </div>
                    <div class="list-search-field">
                        <TextField bind:value={$groupSearchTerm} />
                    </div>
                    <div class="list-actions-wrapper" class:visible={$groupSelectable && $groupSelection.length > 0}>
                        <div class="list-actions-inner-wrapper">
                            <IconButton width=20 svg={mdiLaunch} disabled={$numAvailableArtifacts === 0} on:click={selectArtifact}/>
                            <IconButton width=20 svg={mdiRefresh} on:click={restart}/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="list-items-wrapper">
                {#each $groups as id (id)}
                <Group {id}
                       store={groups.get(id)}
                       publish={publish.get('group.' + $groupAppLookup[id])}
                       visible={groupFilter.get(id)}
                       selected={groupSelection.get(id)}
                       selectable={$groupSelectable}/>
                {/each}
            </div>
        </div>
    </div>
    <div class="section notifications">
        <div class="list-container">
            <div class="list-title">
                <h3>Notifications</h3>
            </div>
            <div class="list-items-wrapper">
                {#each $notifications as id (id)}
                    <Notification {id} store="{notifications.get(id)}" on:dismissed={notificationDismissed} />
                {/each}
            </div>
        </div>
    </div>
</div>

<!-- <DeploymentPanel {instanceStore} {deploymentStore}/> -->

<div class="deployment-panel" class:visible={$distributions.length + $deployments.length > 0}>
    <div class="list-title">
        <h3>Distributions</h3>
        <Switch bind:enabled={distributionsExpanded}/>
    </div>
    <div class="deployment-panel-list-wrapper">
        <div class="deployment-panel-list" class:visible={distributionsExpanded}>
            {#each $distributions as id (id)}
                <Distribution {id} store={distributions.get(id)}/>
            {/each}
        </div>
    </div>
    <div class="list-title">
        <h3>Deployments</h3>
        <Switch bind:enabled={deploymentsExpanded}/>
    </div>
    <div class="deployment-panel-list-wrapper">
        <div class="deployment-panel-list" class:visible={deploymentsExpanded}>
            {#each $deployments as id (id)}
                <Deployment {id} store={deployments.get(id)} instanceStore={instances} artifactStore={artifacts} on:cancel={deploymentCanceled}/>
            {/each}
        </div>
    </div>
</div>

<!--<div class="notification-panel">-->
<!--    {#each $notifications as id (id)}-->
<!--        <Notification {id} store="{notifications.get(id)}" on:dismissed={notificationDismissed} />-->
<!--    {/each}-->
<!--</div>-->

<!-- <ArtifactSelectionModal bind:this={artifactModal} {artifacts} {selectableArtifacts} /> -->

<Modal bind:this={artifactModal} width="400px">
    <div class="modal-content-wrapper">
        <div class="modal-title">
            <span>Select {$selectedApp} release</span>
            <IconButton width=20 svg={mdiRefresh} on:click={discoverArtifacts}/>
        </div>
        {#each $artifacts as id (id)}
            <Artifact {id} store={artifacts.get(id)} visible={selectableArtifacts.get(id)} selected={artifactSelection.get(id)}/>
        {/each}
        <TextButton text="Deploy" disabled={$artifactSelection.length === 0} on:click={deploy}/>
    </div>
</Modal>

<style>
.container {
    display: flex;
    justify-content: center;
    background: rgba(32, 32, 32, .1);
    width: 100%;
    height: 100%;
}

.section {
    background: white;
    margin: 15px;
    flex-grow: 0;
    flex-basis: 350px;
    min-width: 300px;
    border-radius: 5px;
}

.notifications {
    flex-grow: 1;
}

.list-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.list-header {
    box-shadow: inset 0 -1px rgba(100,121,143,0.122);
    padding-bottom: 8px;
    padding-left: 15px;
    padding-right: 15px;
}

.list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
}

.list-title h3 {
    font-size: 16px;
    font-weight: normal;
    margin: 0px;
}

.list-toolbar {
    display: flex;
    /*padding-left: 15px;*/
    align-items: center;
}

.checkbox-dropdown-wrapper {
    width: 0px;
    opacity: 0;
    transition: width 0.15s ease-in-out, opacity 0.15s ease-in-out;
    position: relative;
}

.checkbox-dropdown-wrapper.visible {
    width: 40px;    /* Must have a set width in order to animate */
    opacity: 1;
}

.list-search-field {
    flex-grow: 1
}

.list-actions-wrapper {
    overflow: hidden;
    width: 0px;
    /*height: 31px;*/
    transition: width 0.15s ease-in-out, opacity 0.15s ease-in-out;
    opacity: 0;
}

.list-actions-wrapper.visible {
    width: 63px;    /* Must have a set width in order to animate */
    opacity: 1;
    padding-left: 5px;
}

.list-actions-inner-wrapper {
    display: flex;
    justify-content: space-between;
    /*white-space: nowrap;*/
}

.list-items-wrapper {
    flex: 1 1 auto;
    overflow-y: auto;
    transition: transform .15s ease-in-out;
}

.deployment-panel {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 350px;
    /*height:300px;*/
    background: white;
}

.deployment-panel:not(.visible) {
    display: none;
}

.deployment-panel-list-wrapper {
    overflow-y: auto;
    max-height: 33vh;
}

.deployment-panel-list:not(.visible) {
    display: none;
}

.deployment-panel-list:not(.visible) {
    display: none;
}

.notification-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 350px;
    height: 100vh;
    display: flex;
    flex-direction: column-reverse;
}

.modal-content-wrapper {
    padding: 25px;
}
.modal-title {
    font-size: 1.25rem;
    line-height: 2rem;
    padding-bottom: 25px;
}






</style>
