
<script>

import Modal from './Modal.svelte';
import SingleSelectList from './SingleSelectList.svelte';
import Artifact from './Artifact.svelte';
import TextButton from './TextButton.svelte';

export let artifacts, selectableArtifacts;

let modal, open = false, app, instances;

export function show() {
    console.log("showing modal")
    open = true;
}

</script>

<Modal bind:open={open} width="400px">
    <div class="inner">
    <div class="title">Select {app} release</div>
    {#each $artifacts as id (id)}
        <Artifact {id} store={artifacts.get(id)} visible={selectableArtifacts.get(id)}/>
    {/each}

    <TextButton text="Deploy" />
</Modal>

<style>
    .inner {
        padding: 25px;
    }
    .title {
        font-size: 1.25rem;
        line-height: 2rem;
        padding-bottom: 25px;
    }

    
</style>