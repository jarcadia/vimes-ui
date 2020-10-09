<script>
import { createEventDispatcher } from 'svelte';
import { createPopper } from '@popperjs/core';

import tippy from 'tippy.js';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/svg-arrow.css'; /* CSS to rotate and position svg arrow based on placement */



export let target,
        placement='bottom',
        backgroundColor='#ffffff',
        borderColor='#000000',
        borderWidth=1,
        borderRadius=5,
        arrow=false,
        arrowSize=5,
        interactive=false,
        animation=undefined,
        trigger=undefined,
        skid=undefined,
        distance=undefined,
        duration=undefined,
        triggerTarget=null;

$: style=`background: ${backgroundColor};border-radius: ${borderRadius}px`;
$: arrowElement = arrow ? `<svg width="16" height="6" fill=${backgroundColor}> <path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z" /> </svg>` : false;


const dispatch = createEventDispatcher();
let element, tippyInst;

export function hide() {
    tippyInst.hide();
}

$: if (target && element) {

    const targetEl = target instanceof Function ? target() : target;

    tippyInst = tippy(targetEl, {
        content: element,
        triggerTarget: triggerTarget,
        interactive: interactive,
        trigger: trigger,
        placement: placement,
        animation: animation,
        duration: duration,
        arrow: arrowElement,
        offset: [skid, distance],
        onHide(instance) {
            dispatch('hide');
        },
        onShow(instance) {
            dispatch('show');
        },
        ignoreAttributes: true,

        // hideOnClick: 'toggle'
        // trigger: 'click',
    });

}
</script>

<div class="veil">
    <div bind:this={element} style={style} class="popover">
        <slot></slot>
    </div>
</div>

<style>
    .veil {
        display: none;
    }
    .popover {
        box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
    }
</style>