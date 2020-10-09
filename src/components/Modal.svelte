<script>
import { onMount } from 'svelte';

export let open = false;
export let width = "50%"
export let height = "calc(100vh - 40px)"

let scrollableEl;

let doc;
onMount(() => {
    doc = window.document;
});

$: if (doc && open) {
    doc.body.style.overflow = 'hidden';
}

$: if (doc && !open) {
    doc.body.style.removeProperty('overflow');
    scrollableEl.scrollTop = 0;
}

function modalClicked(e) {
    e.stopPropagation();
}

function overlayClicked() {
    open = false;
}

export function show() {
    open = true;
}

export function hide() {
    open = false;
}
</script>

<div class="overlay" class:invisible={!open}/>
<div bind:this={scrollableEl} class="scrollable" class:invisible={!open} on:click={overlayClicked}>
    <div class="modal" class:invisible={!open} on:click={modalClicked} style={'width:' + width}>
        <slot />
    </div>
</div>


<style>
    div.overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: black;
        opacity: 50%;
        z-index: 1
    }

    div.scrollable {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 2
    }

    div.modal {
        position: relative;
        margin-top: 1.75rem;
        margin-right: auto;
        margin-bottom: 1.75rem;
        margin-left: auto;
        background: white;
        max-width: 94%;
    }

    div.invisible {
        visibility: hidden;
    }
</style>

