<!-- Based on idea from: http://www.cssarrowplease.com/ -->
<script>

    export let size, borderWidth = 1, placement, referenceHidden, backgroundColor, borderColor;

    $: right = placement.startsWith('left');
    $: left = placement.startsWith('right');
    $: top = placement.startsWith('bottom');
    $: bottom = placement.startsWith('top');
    $: beforeOffset = Math.round(borderWidth * Math.sqrt(2));
</script>

<div data-popper-arrow class:reference-hidden={referenceHidden}
                       class:top class:right class:bottom class:left
                       style={'--size:' + size + ';--width:' + borderWidth + ';--bgc:' + backgroundColor + ';--bc:' + borderColor + ';--bgc_trans:' + backgroundColor + '00;--bc_trans:' + borderColor + '00;--before_offset:' + beforeOffset}></div>

<style>
    div {
      width: 0px;
      height: 0px;
      position: absolute;
    }

    .reference-hidden {
        visibility: hidden;
        pointer-events: none;
    }

    .top { top: 0; }

    .right { right: 0; }

    .bottom { bottom: 0; }

    .left { left: 0; }

    div:after, div:before {
        content: " ";
        position: absolute;
        left: 50%;
        height: 0;
        width: 0;
        border: solid transparent;
        pointer-events: none;
    }

    div:after {
        border-color: var(--bgc_trans);
        border-width: calc(var(--size) * 1px);
    }

    div:before {
        border-color: var(--bc_trans);
        border-width: calc((var(--size) + var(--before_offset)) * 1px);
    }

    /* Set psuedo element positions */ 
    .left:after, .left:before { right: 0; }

    .right:after, .right:before { left: 0; }

    .top:after, .top:before { bottom: 0; }

    .bottom:after, .bottom:before { top: 0; }

    /* Set directional margins */
    .top:before, .bottom:before { margin-left: calc((var(--size) + var(--before_offset)) * -1px); }

    .top:after, .bottom:after { margin-left: calc(var(--size) * -1px); }

    .left:before, .right:before { margin-top: calc((var(--size) + var(--before_offset)) * -1px); }

    .left:after, .right:after { margin-top: calc(var(--size) * -1px); }

    /* Set directional border color overrides */
    .left:after { border-right-color: var(--bgc); }

    .left:before { border-right-color: var(--bc); }

    .right:after { border-left-color: var(--bgc); }

    .right:before { border-left-color: var(--bc); }

    .top:after { border-bottom-color: var(--bgc); }

    .top:before { border-bottom-color: var(--bc); }

    .bottom:after { border-top-color: var(--bgc); }

    .bottom:before { border-top-color: var(--bc); }


</style>