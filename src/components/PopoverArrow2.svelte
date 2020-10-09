<!-- Based on idea from: http://www.cssarrowplease.com/ -->
<script>
  import Triangle from './Triangle.svelte';
  import BorderedTriangle from './BorderedTriangle.svelte';

    export let placement, size, borderWidth = 1, referenceHidden, backgroundColor, borderColor;

    $: right = placement.startsWith('left');
    $: left = placement.startsWith('right');
    $: top = placement.startsWith('bottom');
    $: bottom = placement.startsWith('top');

    $: triangleDirection = top ? "up" : right ? "right" : bottom ? "down" : "left";
    $: borderTriangleSize = parseInt(size) + Math.round(borderWidth * Math.sqrt(2))

</script>

<div data-popper-arrow class:reference-hidden={referenceHidden} class:top class:right class:bottom class:left>
    <Triangle direction={triangleDirection} color={borderColor} size={borderTriangleSize} />
    <Triangle direction={triangleDirection} color={backgroundColor} {size} />
</div>
<style>
    div {
      width: 0px;
      height: 0px;
      background: blue;
      background: transparent;
    }

    .top { top: 0; }

    .right { right: 0; }

    .bottom { bottom: 0; }

    .left { left: 0; }

</style>