<script>
    export let enabled = false;

    export function toggle() {
        enabled = !enabled;
    }

</script>
<div class="container" class:enabled>
    <div class="track" />
    <div class="thumb-underlay" on:click={toggle}>
        <div class="thumb" />
    </div>
</div>

<style>
    .container {
        position: relative;
        width: 100px;
        width: 32px;
        height: 14px;
    }

    .track {
        background: rgba(32, 32, 32, .5);
        width: 32px;
        height: 14px;
        border-radius: 7px;
    }

    .thumb-underlay {
        position: absolute;
        left: -19px;
        top: 50%;
        width: 48px;
        height: 48px;
        margin-top: -24px;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        transition: transform .15s;
    }

    .thumb-underlay:hover {
        background: rgba(32, 32, 32, .1);
    }

    .thumb {
        position: absolute;
        /*left: -5px;*/
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        background: white;
        border-radius: 50%;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0,0,0,.12);
    }

    .container.enabled .track {
        background: rgba(0,123,255, .5);
    }

    .container.enabled .thumb {
        background: rgb(0,123,255);
    }

    .container.enabled .thumb-underlay {
        transform: translate(22px, 0);
    }

    .container.enabled .thumb-underlay:hover {
        background: rgba(0,123,255, .1);
    }

</style>

