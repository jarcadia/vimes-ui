<script>
import { createEventDispatcher } from 'svelte';
import { createPopper } from '@popperjs/core';
import PopoverArrow from './PopoverArrow2.svelte';

export let target,
        visible = false,
        placement = 'bottom',
        zIndex = 2,
        autoclose = true,
        offset = 0,
        skid = 0,
        arrowSize = 5,
        borderWidth=1,
        backgroundColor='#ffffff',
        borderColor='#000000';

let triggeringEvent;
export function show(event) {
    triggeringEvent = event;
    visible = true;
}

let element, popper;

let dynamicPlacement = placement, referenceHidden = false;

const reactiveMod = {
    name: 'reactiveMod',
    enabled: true,
    phase: 'main',
    fn({ state }) {
        dynamicPlacement = state.placement;
        referenceHidden = state.modifiersData.hide.isReferenceHidden;
    },
};

const mouseup = (event) => {
    if (event !== triggeringEvent) {
        console.log('Autoclosing');
        visible = false;
        window.removeEventListener('mouseup', mouseup);
    }
}

$: if (target && element) {

    popper = createPopper(target instanceof Function ? target() : target, element, {
        placement: placement,
        hide: true,
        modifiers: [
            reactiveMod,
            {
                name: 'offset',
                options: {
                    offset: [skid, offset + arrowSize],
                },
            }, {
                name: 'arrow',
                options: {
                    padding: arrowSize + 10
                },
            }
        ]
    });
    if (autoclose) {
        window.addEventListener('mouseup', mouseup);
    }
}

$: style = `border-style:solid;background:${backgroundColor};border-color:${borderColor};border-width:${borderWidth}px;z-index:${zIndex}`;

const dispatch = createEventDispatcher();
$: if (visible) {
    dispatch('show')
} else {
    dispatch('hide')
}

</script>

{#if visible}
<div class="popover" bind:this={element} {style} class:reference-hidden={referenceHidden}>
    <slot></slot>
    <PopoverArrow size={arrowSize}
                  placement={dynamicPlacement}
                  {referenceHidden}
                  {borderWidth}
                  {backgroundColor}
                  {borderColor}/>
</div>
{/if}

<style>
    .popover.reference-hidden {
        visibility: hidden;
        pointer-events: none;
    }
</style>