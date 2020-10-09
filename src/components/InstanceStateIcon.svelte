<script>
    import { mdiArrowForward } from '../js/icons';
    import Icon from './Icon.svelte';

    export let state;

    $: enabled = state === 'Enabled';
    $: draining = state === 'Draining';
    $: disabled = state === 'Disabled';
    $: down = state === 'Down';

    let timerId, drainingFalling = undefined;;

    $: {
        if (state === 'Draining') {
            drainingFalling = true;
            timerId = setInterval(() => {
                console.log('Reversing');
                drainingFalling = !drainingFalling;
            }, 500);
        } else {
            drainingFalling = undefined;
            clearInterval(timerId);
        }
    }

</script>

<div class="background" class:enabled class:disabled class:draining class:down>
    <div class="icon" class:falling={drainingFalling} class:rising={!drainingFalling}>
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

    .background.enabled {
        background: #5cb85c;
    }

    .background.disabled {
        background: #f0ad4e;
    }

    .background.down {
        background: #d9534f;
    }

    .background.draining {
        background: #A6B355;
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

    .background.enabled .icon {
        transform: rotate(-90deg);
    }

    .background.down .icon {
        transform: rotate(90deg);
    }

    .background.draining .icon {
        transform: rotate(-45deg);
    }

</style>