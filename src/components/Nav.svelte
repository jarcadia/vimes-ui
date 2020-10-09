
<script>
    export let term = undefined;
</script>

<div class="nav">
    <div class="text-field-container">
    <input bind:value={term} placeholder="Search">
    </div>
</div>

<style>
    .nav {
        height: 35px;
    }

    div.text-field-container {
        padding: 6px 8px 7px 8px;
        border-color: rgba(0,0,0,.38);
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        flex-grow: 1;
    }

    div.text-field-container:focus-within {
        border-color: green;
    }

    div.text-field-container input:focus {
        outline: none;
    }
</style>