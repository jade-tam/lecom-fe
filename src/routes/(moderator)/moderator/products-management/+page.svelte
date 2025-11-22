<script>
	import { invalidateAll } from '$app/navigation';
	import showToast from '$lib/utils/showToast';
	import ModeratorProductsTable from './(components)/ModeratorProductsTable.svelte';

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

<ModeratorProductsTable products={data.pendingProducts} />
