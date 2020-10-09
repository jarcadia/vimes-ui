<script>
    import { ripple } from '../js/ripple';

    export let text = 'Button', disabled = false;

</script>
<button use:ripple={{opacity: .5, color: 'blue'}} class:disabled on:click >{text}</button>


<style>
    button {
        position: relative;
        border: none;
        padding: 8px;
        background: transparent;
        overflow: hidden;
        padding-right: 16px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 16px;
        border-radius: 4px;
        /*background: var(--primary-color);*/
    }

    button:hover {
        background-color: rgba(0, 0, 255, .1)
    }

    button:focus {
        outline: none;
        background-color: rgba(0, 0, 255, .2)
    }

</style>