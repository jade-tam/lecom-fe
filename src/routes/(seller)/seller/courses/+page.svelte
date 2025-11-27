<script>
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import showToast from '$lib/utils/showToast';
	import SellerCoursesTable from './(components)/SellerCoursesTable.svelte';

	const { data, form } = $props();

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);

			if (form.toastData.type === 'success') {
				(async () => {
					console.log('invalidating seller:courses...');
					await invalidate('seller:courses');
					// inspect current page store to see if data changed
					console.log('page.data.courses after invalidate:', page.data.courses);
				})();
			}
		}
	});
</script>

<SellerCoursesTable courses={data.courses} />
