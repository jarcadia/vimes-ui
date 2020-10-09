<script>
    export let size = 24, color = 'blue';

    $: strokeWidth = size / 8;
    $: radius = (size / 2) - (strokeWidth / 2);
    $: circumference = 2 * radius * Math.PI;
    $: offset1 = circumference * -0.27852116402;
    $: offset2 = circumference * -.99;
    $: dashStart = circumference + offset1;
</script>
<svg class="circular-progress" viewBox={`0 0 ${size} ${size}`} style={`width: ${size}px;height: ${size}px;stroke: ${color}`}>
    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke-width={strokeWidth} style={`--circumference: ${circumference}; --dashStart: ${dashStart}; --offset1: ${offset1}; --offset2: ${offset2}`} />
</svg>
<style>


svg {
    animation: rotate 2.0s linear infinite;
}

svg circle {
    stroke-dasharray: 1, var(--circumference);
    stroke-dashoffset: 0;
    stroke-linecap: square;
    /*animation: dash 1.33s ease-in-out infinite;*/
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, var(--circumference);
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: var(--dashStart), var(--circumference);
        stroke-dashoffset: var(--offset1);
    }

    100% {
        stroke-dasharray: var(--dashStart), var(--circumference);
        stroke-dashoffset: var(--offset2);
    }
}
</style>