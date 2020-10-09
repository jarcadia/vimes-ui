<script>
import Nav from '../components/Nav.svelte';
import { searchTerm } from '../js/stores';

export let segment;

</script>

<div class="layout">
    <div class="nav-wrapper">
        <Nav bind:term={$searchTerm} {segment}/>
    </div>
    <div class="content-wrapper">
        <slot></slot>
    </div>
</div>



<style>
    .layout {
        display: flex;
        width: 100vw;
        height: 100vh;
        flex-direction: column;
    }

    .nav-wrapper {
        flex-grow: 0;
        flex-shrink: 0;
    }

    .content-wrapper {
        flex-grow: 1;
        flex-shrink: 1;
        min-height: 0;
    }

</style>