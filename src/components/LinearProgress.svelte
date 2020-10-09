
<script>

    export let percent = 0.0;

</script>

<div class="track"> 
    <div class="bar" style={`transform: scaleX(${percent})`}/>
</div>

<style>
    .track {
        width: 100%;
        height: 4px;
        background-color: rgb(230, 230, 230);
    }

    .bar {
        width: 100%;
        height: 4px;
        background: rgb(0,123,255);
        transform-origin: left;
    }
</style>