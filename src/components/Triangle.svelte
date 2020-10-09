<script>
export let direction = 'up', size = 16, color = 'blue';

$: border = direction === 'up' ? 'bottom': direction === 'right' ? 'left' : direction == 'down' ? 'top' : 'right';
$: topMargin = direction === 'up' ? size * -2 : direction === 'right' || direction === 'left' ? -size : 0;
$: leftMargin = direction === 'left' ? size * -2 : direction === 'up' || direction === 'down' ? -size : 0;
$: style = 'border-width: ' + size + 'px; border-' + border + '-color: ' + color + ';margin-top: ' + topMargin + 'px; margin-left: ' + leftMargin + 'px';

</script>

<div class="basis">
    <div class="triangle" style={style}/>
</div>

<style>

    .basis {
        position: absolute;
        width: 0;
        height: 0;
        pointer-events: none;
    }

    .triangle {
        position: absolute;
        border-style: solid;
        border-color: transparent;
        width: 0;
        height: 0;
    }
</style>


