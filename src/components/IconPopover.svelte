<!--<script>-->
<!--    /*-->
<!--        TODO: WIP-->

<!--        This component should be an image that appears like an IconButton-->

<!--        When the image is hovered, the background darkens and a Popover appears with the <slotted> content.-->

<!--        The background remains darkened as long as the mouse is in the hoverable or over the button-->

<!--        It should trigger on a transparent div optionally at a specified Z-index to help bring ensure it doesn't lose-->
<!--        state due to another widow appearing (popover)-->

<!--        It should also emit show and hide events-->
<!--     */-->
<!--    import { createEventDispatcher } from 'svelte';-->
<!--    import Icon from './Icon.svelte';-->
<!--    export let width = 20, height = undefined, disabled = false, svg;-->

<!--    const dispatch = createEventDispatcher();-->
<!--    function onClick(event) {-->
<!--        if (disabled) {-->
<!--            event.stopPropagation();-->
<!--        } else {-->
<!--            dispatch('click');-->
<!--        }-->
<!--    }-->

<!--</script>-->

<!--<button class:disabled use:ripple={{radius: 30, centered: true, disabled: disabled}} on:click={onClick}>-->
<!--    <div class="center">-->
<!--        <Icon {width} {height} {svg} />-->
<!--    </div>-->
<!--</button>-->

<!--<style>-->

<!--    button {-->
<!--        outline: none;-->
<!--        position: relative;-->
<!--        border: none;-->
<!--        border-radius: 50%;-->
<!--        width: 30px;-->
<!--        height: 30px;-->
<!--        cursor: pointer;-->
<!--    }-->

<!--    button.disabled {-->
<!--        cursor: not-allowed;-->
<!--    }-->

<!--    button:hover {-->
<!--        background: rgba(32,32,32, .1);-->
<!--    }-->

<!--    button:focus {-->
<!--        background: rgba(32,32,32, .2);-->
<!--    }-->

<!--    .center {-->
<!--        position: absolute;-->
<!--        top: 50%;-->
<!--        left: 50%;-->
<!--        margin: -10px 0 0 -10px;-->
<!--    }-->

<!--</style>-->