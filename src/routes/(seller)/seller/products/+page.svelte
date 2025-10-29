<script>
	import SellerProductsTable from './(components)/SellerProductsTable.svelte';

	const { data } = $props();
</script>

<SellerProductsTable products={data.products} />
