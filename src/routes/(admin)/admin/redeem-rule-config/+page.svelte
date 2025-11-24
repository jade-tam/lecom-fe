<script>
	import showToast from '$lib/utils/showToast';
	import AdminRedeemRulesTable from './(components)/AdminRedeemRulesTable.svelte';

	const { data, form } = $props();

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);
		}
	});
</script>

<AdminRedeemRulesTable redeemRulesPromise={data.redeemRulesPromise} />
