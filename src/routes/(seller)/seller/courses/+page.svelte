<script>
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import showToast from '$lib/utils/showToast';
	import SellerCoursesTable from './(components)/SellerCoursesTable.svelte';

	const { data, form } = $props();

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);
		}
	});
</script>

<SellerCoursesTable courses={data.courses} />
