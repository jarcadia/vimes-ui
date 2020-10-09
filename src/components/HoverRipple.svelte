<!-- <script>
import { createEventDispatcher } from 'svelte';
export let top = '0px', left = '0px', bottom = '0px', right = '0px', offset = undefined, borderRadius = '0px';

$: topVal = offset ? offset : top;
$: leftVal = offset ? offset : left;
$: bottomVal = offset ? offset : bottom;
$: rightVal = offset ? offset : right;

$: styleStr = 'top: ' + topVal + '; left: ' + leftVal + '; bottom: ' + bottomVal + '; right: ' + rightVal + '; border-radius: ' + borderRadius + ';'

let ripple = true;

let hovering = false;
function enter() {
    hovering = true;
}

function leave() {
    hovering = false;
}

const dispatch = createEventDispatcher();
let wrapper;
var rippleEl;


let mouseDown = false;
let rippling = false;

const globalMouseUp = () => {
    mouseDown = false;
    window.removeEventListener('mouseup', globalMouseUp);
}


function onMouseDown() {
    mouseDown = true;
    rippling = true;
    window.addEventListener('mouseup', globalMouseUp);

    if (ripple) {
        if (rippleEl) {
            wrapper.removeChild(rippleEl);
        }
        rippleEl = document.createElement('div');
        rippleEl.style.cssText = 'z-index: -1; position: absolute; background: rgba(32,33,36,0.25); ' + styleStr + 'animation-name: ripple-spread; animation-duration: 0.25s; animation-fill-mode: forwards;'
        wrapper.appendChild(rippleEl)
        rippleEl.addEventListener("animationend", () => {
            rippling = false;
        });

    }
}

function onMouseUp() {
    dispatch('click');
}


$: {
    if (!mouseDown && !rippling && rippleEl) {
        console.log('Fading ripple', rippleEl.style);
        rippleEl.style.animationName = 'ripple-fade';
    } else if (mouseDown && !rippling) {
        console.log('Mouse still down');
    } else if (!mouseDown && rippling) {
        console.log('Still ripping');
    } else {
        console.log('Rippling');
    }
}


</script>

<div bind:this={wrapper} class="wrapper" on:mousedown={onMouseDown} on:mouseup={onMouseUp} class:hovering>
    <div class="positioned indicator" style={styleStr} />
    <slot></slot>
    <div class="positioned glass" style={styleStr} on:mouseenter={enter} on:mouseleave={leave}/>
</div>

<style>
    .wrapper {
        position: relative;
        display: flex;
        cursor: pointer;
    }

    .indicator {
        z-index: -1;
        background: rgba(32,32,32,0.1);
        transition-property: transform,opacity;
        transition-duration: .15s;
    }

    .glass {
        z-index: 10;
        cursor: pointer;
        background: transparent;
    }

    .positioned {
        position: absolute;
        left: -10px;
        top: -10px;
        right: -10px;
        bottom: -10px;
        border-radius: 4px;
    }

    .wrapper:not(.hovering) .indicator {
        transform: scale(0);
        opacity: 0;
    }

    @keyframes -global-ripple-spread {
        0%   {transform: scale(0); opacity: 0}
        100%  {transform: scale(1); opacity: 1}
        /*100% {transform: scale(1); opacity: 0}*/
    }

    @keyframes -global-ripple-fade {
        0%   {opacity: 1}
        100%  {opacity: 0}
        /*100% {transform: scale(1); opacity: 0}*/
    }

</style> -->