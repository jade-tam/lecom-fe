<script>
	import AdminRefundsTable from './(components)/AdminRefundsTable.svelte';

	const { data } = $props();
</script>

<AdminRefundsTable
	refundsPromise={data.refundsPromise}
	reviewRefundFormData={data.reviewRefundFormData}
/>
