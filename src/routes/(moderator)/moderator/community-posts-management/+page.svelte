<script>
	import showToast from '$lib/utils/showToast';
	import ModeratorCommunityPostsTable from './(components)/ModeratorCommunityPostsTable.svelte';

	const { data, form } = $props();

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);
		}
	});
</script>

<ModeratorCommunityPostsTable moderatorPendingCommunityPostsPromise={data.moderatorPendingCommunityPostsPromise} />
