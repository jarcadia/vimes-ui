<script>
    export let size = 24, color = 'rgb(0,123,255)', percent =  0.0;
    $: strokeWidth = size / 8;
    $: radius = (size / 2) - (strokeWidth / 2);
    $: circumference = 2 * radius * Math.PI;
</script>

<div class="container" style={`width: ${size}px;height: ${size}px`}>
    <svg class="track" viewBox={`0 0 ${size} ${size}`} style={`width: ${size}px;height: ${size}px;--circumference: ${circumference}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke-width={strokeWidth} />
    </svg>
    <svg class="progress" viewBox={`0 0 ${size} ${size}`} style={`width: ${size}px;height: ${size}px;stroke: ${color};--circumference: ${circumference}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke-width={strokeWidth} style={`--percent: ${percent}`} />
    </svg>
</div>
<style>
    .container {
        position: relative;
    }

    svg.track {
        stroke: rgba(100,121,143,0.122);
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
    }
svg.progress {
    transform: rotate(270deg);
}

svg.progress circle {
    stroke-dasharray: var(--circumference), var(--circumference);
    stroke-dashoffset: calc(var(--circumference) - var(--percent) * var(--circumference));
    transition: stroke-dashoffset .5s ease-in-out;
}

</style>