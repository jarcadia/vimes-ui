<script>
import RadioButton from './RadioButton.svelte';

export let id, store, visible, selected;
$: data = $store;

</script>

 <div class="container" class:visible={$visible}>
    <RadioButton bind:selected={$selected}/>
    <div>{id} - {data.version}</div>
</div>


<style>
    div.container {
        display: none;
        align-items: center;
        box-shadow: inset 0 -1px 0 rgba(100,121,143,0.122)
    }
    div.container.visible {
        display: flex;
    }
    div.name {
        margin-left: 10px;
    }
</style>