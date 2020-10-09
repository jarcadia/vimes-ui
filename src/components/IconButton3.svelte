<script>
    import { tick, createEventDispatcher } from 'svelte';
    import HoverRipple from './HoverRipple.svelte';
    import { ripple } from '../js/ripple';
    import Icon from './Icon.svelte';
    export let width = 20, height = undefined, disabled = false, progagateEvents = false, svg;

    function onClick(event) { processEvent(event, 'click') }
    function onMouseUp(event) { processEvent(event, 'up') }
    function onMouseEnter(event) { processEvent(event, 'enter') }
    function onMouseLeave(event) { processEvent(event, 'leave') }

    const dispatch = createEventDispatcher();
    function processEvent(event, name) {
        if (!disabled) {
            dispatch(name);
        }

        if (disabled || !progagateEvents) {
            event.stopPropagation();
        }
    }

    let rootElement;
    export function el() { return rootElement}

</script>

<button bind:this={rootElement}
        class:disabled
        use:ripple={{radius: 30, centered: true, disabled: disabled}}
        on:click={onClick}
        on:mouseup={onMouseUp}
        on:mouseenter={onMouseEnter}
        on:mouseenter={onMouseEnter}
        on:mouseleave={onMouseLeave}>
    <div class="center">
        <Icon {width} {height} {svg} />
    </div>
</button>

<style>

    button {
        outline: none;
        position: relative;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }

    button.disabled {
        cursor: not-allowed;
    }

    button:hover {
        background: rgba(32,32,32, .1);
    }

    button:focus {
        background: rgba(32,32,32, .2);
    }

    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -10px 0 0 -10px;
    }

</style>