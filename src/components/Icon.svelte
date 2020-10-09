<script>
    export let width = 16, height = undefined, svg;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height === undefined ? height : width} viewBox={svg.viewbox}>
    {#each svg.paths as {d, fill, fillRule}}
        <path {d} {fill} {fillRule}/>
    {/each}
</svg>

<style>
    svg {
        fill: currentColor;
    }
</style>