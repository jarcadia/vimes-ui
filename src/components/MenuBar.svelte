<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();


</script>
<div>
	<button type="button" on:click="{() => dispatch('deploy', 'deets')}">Deploy</button>
</div>



<style>
	div {
		box-shadow: inset 0 -1px 0 rgba(100,121,143,0.122)
	}
</style>