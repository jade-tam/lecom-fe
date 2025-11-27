<script>
	import SellerOrdersTable from './(components)/SellerOrdersTable.svelte';

	const { data } = $props();
</script>

<SellerOrdersTable ordersPromise={data.ordersPromise} />
