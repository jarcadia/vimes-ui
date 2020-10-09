<script>
export let expanded = false;
</script>

<svg class:expanded viewBox="7 10 10 5" >
    <path fill-rule="evenodd" opacity='.54' d='M7 10l5 5 5-5z'/>
</svg>


<style>
    svg {
        position: relative;
        width: 10px;
        height: 5px;
        transition-property: transform;
        transition-duration: .15s;
    }

    .expanded {
        transform: rotate(180deg);
    }
</style>