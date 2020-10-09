<script>
    import { createEventDispatcher } from 'svelte';
    import { fade, draw } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let checked = false, indeterminate = false, disabled = false;

    const dispatch = createEventDispatcher();
    export function toggle(event) {
        if (!disabled) {
            indeterminate = false;
            checked = !checked;
            dispatch(checked ? 'check' : 'uncheck');
        }
    }

    function markIndeterminate() {
        indeterminate = true;
    }

</script>
<div class="box" class:checked class:indeterminate class:disabled on:mouseup|stopPropagation={toggle}>
    {#if indeterminate}
    <svg viewBox="0 0 24 24">
        <path fill="none" stroke="white" d="M1,12 23,12"></path>
    </svg>
    {:else if checked}
    <svg viewBox="0 0 24 24">
        <path in:draw="{{duration: 200, easing: quintOut}}" fill="none" stroke="white" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
    </svg>
    {/if}
</div>

<style>

div.box {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 2px;
    border-radius: 2px;
    border-color: rgba(0,0,0,.54);
    background-color: transparent;
    position: relative;
    cursor: pointer;
}

div.box.disabled {
    cursor: not-allowed;;
}

div.box.checked, div.box.indeterminate {
    border-color: rgb(0,123,255);
    background: rgb(0,123,255);
}

svg {
    position: absolute;
    left: -1px;
    top: -1px;
    width: 14px;
    height: 14px;
    stroke-width: 3px;
}

</style>