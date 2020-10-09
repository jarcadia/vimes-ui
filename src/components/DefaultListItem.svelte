<script>

export let id, label = undefined, selected = false;
$: text = label !== undefined ? label : id;


function itemClick() {
    console.log('Item clicked');
    selected = true;
}

</script>

 <div class="item" class:selected on:click={itemClick}>
    <div class="label">{text}</div>
</div>

<style>
    div.item {
        display: flex;
        align-items: center;
        /*box-shadow: inset 0 -1px 0 rgba(100,121,143,0.122);*/
        cursor: pointer;
    }
    div.item.selected { 
    }
    div.label {
        margin-left: 10px;
        margin-right: 10px;
    }

    div.item:hover {
        background: rgba(242,245,245,0.8);
        /*box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15);*/
    }
</style>