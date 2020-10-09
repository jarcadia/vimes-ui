<!-- <script>
    import { tick } from 'svelte';
    import HoverRipple from './HoverRipple.svelte';
    import Icon from './Icon.svelte';
    export let width = 16, height = undefined, svg;

    let button;
    var ripple;
    // function click() {
    //     console.log('Click');
    //     if (ripple) {
    //         button.removeChild(ripple);
    //     }
    //     ripple = document.createElement('div');
    //     ripple.style.cssText = 'z-index: -1; position: absolute; background: rgba(32,33,36,0.25); border-radius: 50%; left: 0; top: 0; right: 0; bottom: 0; transform: scale(1); opacity: 1; animation-name: ripple-effect; animation-duration: .5s;'
    //     button.appendChild(ripple)
    //     ripple.addEventListener("animationend", () => {
    //         console.log('Done animating');
    //         button.removeChild(ripple)
    //         ripple = undefined;
    //     });
    // }

</script>



<HoverRipple borderRadius="50%" offset="-15px">
    <Icon {width} {height} {svg} />
</HoverRipple>

<style>

</style> -->