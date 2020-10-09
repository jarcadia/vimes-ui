<script>
    import { createEventDispatcher } from 'svelte';
    import { scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let selected = false;

    export function select() {
        selected = true;
    }

    export function deselect() {
        selected = false;
    }

    const dispatch = createEventDispatcher();
    function onSelect() {
        if (selected !== true) {
            selected = true;
            dispatch('select', deselect);
        }
    }

</script>
<div class="outer" class:selected on:click={onSelect}>
    {#if selected}
        <div class="inner" class:selected transition:scale="{{duration: 150, easing: quintOut}}"> </div>
    {/if}
</div>

<style>
div.outer {
    min-width: 18px;
    min-height: 18px;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 2px;
    border-radius: 50%;
    border-color: rgba(0,0,0,.54);
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

div.inner {
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 4px;
    border-radius: 50%;
    border-color: rgba(0,0,0,.54);
    cursor: pointer;
}

div.selected {
    border-color: rgb(0,123,255);
}
</style>