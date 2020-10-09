<script>
    import { fade, slide } from 'svelte/transition';
    import Clickable from './Checkbox.svelte';
    import Checkbox from './Checkbox.svelte';
    import DropDownIcon from './DropDownIcon.svelte';
    import Popover from './Popover2.svelte';
    import SingleSelectList from './SingleSelectList.svelte';
    import HoverRipple from './HoverRipple.svelte';

    export let grouped, selection;
    const collective = selection.collective;

    let container, dropdownHoverable, popover, expanded = false;

    const selectAll = () => selection.selectAll();
    const deselectAll = () => selection.selectNone();
    const selectOnly = option => {
        selection.selectOnly($grouped[option]);
        popover.hide();
    }

</script>

<div class="container" tabindex="0" bind:this={container}>
    <Checkbox checked={$collective === 'all'}
              indeterminate={$collective === 'partial'}
              on:check={selectAll}
              on:uncheck={deselectAll}/>
    <div bind:this={dropdownHoverable} class="dropdown-icon-wrapper hoverable" >
        <svg class="dropdown-icon" class:expanded viewBox="7 10 10 5" >
            <path fill-rule="evenodd" opacity='.54' d='M7 10l5 5 5-5z'/>
        </svg>
    </div>
</div>

<Popover bind:this={popover}
         target={container}
         triggerTarget={dropdownHoverable}
         placement="bottom-start"
         interactive={true}
         trigger="click"
         animation="scale"
         duration={[150, 150]}
         on:show={() => expanded = true}
         on:hide={() => expanded = false}>
<div class="dropdown-surface">
    {#each Object.keys($grouped) as option}
        <div class="dropdown-list-item"
             on:click={() => selectOnly(option)}>{option}</div>
    {/each}
</Popover>


<style>
    .container {
        display: flex;
        align-items: center;
        border-radius: 4px;
    }

    .dropdown-icon-wrapper {
        border-radius: 4px;
        padding: 5px;
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dropdown-icon {
        width: 10px;
        height: 5px;
        transition-property: transform;
        transition-duration: .15s;
    }

    .dropdown-icon.expanded {
        transform: rotate(180deg);
    }

    .dropdown-surface {
        user-select: none; /* disable text selection */
        padding: 4px;
    }

    .dropdown-list-item {
        cursor: pointer;
        padding: 4px;
    }

    .dropdown-list-item:hover {
        background: rgba(32,32,32, .1);
    }

    .hoverable {
        position: relative;
    }

    .hoverable::before {
        content: '';
        position: absolute 0 0 0 0;
        background: rgba(32, 32, 32, .1);
        border-radius: 4px;
        opacity: 0;
        transform: scale(0);
        transition-property: transform,opacity;
        transition-duration: .15s;
        cursor: pointer;
    }

    .hoverable:hover::before {
        opacity: 1;
        transform: scale(1);
    }

</style>