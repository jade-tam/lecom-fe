<script>
	import { invalidateAll } from '$app/navigation';
	import showToast from '$lib/utils/showToast';
	import SellerProductsTable from './(components)/SellerProductsTable.svelte';

	const { data, form } = $props();

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);

			if (form.toastData.type === 'success') {
				invalidateAll();
			}
		}
	});
</script>

<SellerProductsTable products={data.products} />
