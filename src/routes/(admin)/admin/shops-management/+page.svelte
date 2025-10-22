<script>
	import ShopsTable from './(components)/ShopsTable.svelte';

	const { data } = $props();
</script>



<ShopsTable shops={data.shops} />
