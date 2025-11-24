<script>
	import showToast from '$lib/utils/showToast';
	import AdminVouchersTable from './(components)/AdminVouchersTable.svelte';
	import UsersTable from './(components)/AdminVouchersTable.svelte';

	const { data, form } = $props();

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);
		}
	});
</script>

<AdminVouchersTable vouchersPromise={data.vouchersPromise} />
