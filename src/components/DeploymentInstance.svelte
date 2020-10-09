<script>

export let id, store;

$: host = $store.host;
$: shortHost = host.substring(0, host.indexOf("."));

</script>
<div>{shortHost} ({$store.deploymentState})</div>