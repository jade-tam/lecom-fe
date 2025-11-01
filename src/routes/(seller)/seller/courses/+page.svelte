<script>
	import { invalidate, invalidateAll } from '$app/navigation';
	import showToast from '$lib/utils/showToast';
	import SellerCoursesTable from './(components)/SellerCoursesTable.svelte';

	const { data, form } = $props();

	$inspect(form);

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);

			if (form.toastData.type === 'success') {
				invalidate('seller:courses');
			}
		}
	});
</script>

<SellerCoursesTable courses={data.courses} />
