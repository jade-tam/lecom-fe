<script>
	import RefundsTable from './(components)/RefundsTable.svelte';

	const { data } = $props();
</script>

<RefundsTable refundsPromise={data.refundsPromise} />
