<!-- <script>
    import { tick } from 'svelte';
    import Icon from './Icon.svelte';
    export let width = 16, height = undefined, svg;

    let button;
    var ripple;
    function click() {
        console.log('Click');
        if (ripple) {
            button.removeChild(ripple);
        }
        ripple = document.createElement('div');
        ripple.style.cssText = 'z-index: -1; position: absolute; background: rgba(32,33,36,0.25); border-radius: 50%; left: 0; top: 0; right: 0; bottom: 0; transform: scale(1); opacity: 1; animation-name: ripple-effect; animation-duration: .5s;'
        button.appendChild(ripple)
        ripple.addEventListener("animationend", () => {
            console.log('Done animating');
            button.removeChild(ripple)
            ripple = undefined;
        });
    }

</script>


<button bind:this={button} on:click={click}>
    <Icon {width} {height} {svg} />
</button>

<style>
    button {
        outline:none;
        position:relative;
        display: inline-flex;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    button:hover {
        background: rgba(32,33,36,0.15);
    }

    button:focus {
        background: rgba(32,33,36,0.25);
    }

    @keyframes -global-ripple-effect {
        0%   {transform: scale(0); opacity: 0}
        50%  {transform: scale(1); opacity: 1}
        100% {transform: scale(1); opacity: 0}
    }

</style> -->