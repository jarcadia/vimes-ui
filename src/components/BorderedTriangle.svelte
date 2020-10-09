<script>
import Triangle from './Triangle.svelte';

export let direction = 'up', size = 12, color = 'blue', borderWidth = 3, borderColor = 'red';

$: borderTriangleSize = size + Math.round(borderWidth * Math.sqrt(2))
</script>

<div class="basis">
    <Triangle direction={direction} size={borderTriangleSize} color={borderColor} />
    <Triangle direction={direction} size={size} color={color} />
</div>

<style>
    .basis {
        position: absolute;
        width: 0;
        height: 0;
    }
</style>


