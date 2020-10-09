<script>
    import { mdiArrowForward } from '../js/icons';
    import Icon from './Icon.svelte';

    export let state;

    $: up = state === 'Up';
    $: partial = state === 'Partial';
    $: down = state === 'Down';

</script>

<div class="background" class:up class:partial class:down>
    <div class="icon">
        <Icon width=16 svg={mdiArrowForward} />
    </div>
</div>

<style>
    .background {
        position: relative;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background: #292b2c;
        transition: background-color .35s ease-in-out;
    }

    .background.up {
        background: #5cb85c;
    }

    .background.partial {
        background: #f0ad4e;
    }

    .background.down {
        background: #d9534f;
    }

    .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        margin: -8px 0 0 -8px;
        color: white;
        transform-origin: center;
        transition: transform .5s ease-in-out;
    }

    .background.up .icon {
        transform: rotate(-90deg);
    }

    .background.down .icon {
        transform: rotate(90deg);
    }

</style>