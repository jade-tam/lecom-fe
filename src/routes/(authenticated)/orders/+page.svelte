<script>
	import OrdersTable from './(components)/OrdersTable.svelte';

	const { data } = $props();

	$inspect(data.orders);
</script>

<OrdersTable orders={data.orders} />
