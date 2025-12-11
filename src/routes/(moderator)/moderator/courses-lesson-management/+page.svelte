<script>
	import { invalidateAll } from '$app/navigation';
	import showToast from '$lib/utils/showToast';
	import ModeratorCoursesTable from './(components)/ModeratorCourseLessonsTable.svelte';

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

<ModeratorCoursesTable lessons={data.pendingLessons} />
