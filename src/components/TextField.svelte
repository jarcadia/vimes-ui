<script>
    export let value;
</script>
<div class="container">
    <input bind:value>
</div>

<style>
    .container {
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        padding: 5px;
    }

    input {
        border-style: none;
    }

    input:focus {
        outline: none;
    }
</style>

