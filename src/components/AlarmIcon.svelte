<script>
    import Icon from './Icon.svelte';
    import { mdiInfo, mdiWarning, mdiError } from '../js/icons';
    import has from "lodash/has";

    export let alarms;

    $: maxLevel = has(alarms, 'PANIC') ? 'PANIC' :
        has(alarms, 'CRITICAL') ? 'CRITICAL' :
        has(alarms, 'WARN') ? 'WARN' :
        has(alarms, 'ATTENTION') ? 'ATTENTION' : undefined;

    $: panic = maxLevel === 'PANIC';
    $: critical = maxLevel === 'CRITICAL';
    $: warn = maxLevel === 'WARN';
    $: attention = maxLevel === 'ATTENTION';
    $: svg = warn ? mdiWarning : attention ? mdiInfo : mdiError;


</script>

<div class="wrapper" class:visible={maxLevel !== undefined}>
    <div class="inner-wrapper" class:panic class:critical class:warn class:attention>
        <Icon width=24 {svg} />
    </div>
</div>

<style>
    .wrapper {
        overflow: hidden;
        width: 0px;
        transition: width 0.15s ease-in-out, opacity 0.15s ease-in-out;
        opacity: 0;
    }

    .visible {
        width: 24px;    /* Must have a set width in order to animate */
        opacity: 1;
        padding-left: 5px;
    }

    .inner-wrapper {
        display: flex;
        align-content: center;
    }

    .attention {
        color: rgb(0,123,255);
    }

    .warn {
        color: #ffc107;
    }

    .critical {
        color: #d9534f;
    }

    .panic {
        color: #d9534f;
        animation: shake 1.2s cubic-bezier(.36,.07,.19,.97) none;
        animation-iteration-count: infinite;
        transform: translate3d(0, 0, 0);
    }

    @keyframes shake {
        6%, 18% {
            transform: translate3d(2px, 0, 0);
        }

        12%, 24% {
            transform: translate3d(-2px, 0, 0);
        }

        27% {
            transform: translate3d(0, 0, 0);
        }
    }

</style>