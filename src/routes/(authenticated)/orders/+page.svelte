<script>
	import OrdersTable from './(components)/OrdersTable.svelte';

	const { data, form } = $props();

	$inspect(data.orders);
</script>

<OrdersTable orders={data.orders} />
