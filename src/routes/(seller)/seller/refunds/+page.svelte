<script>
	import SellerRefundsTable from './(components)/SellerRefundsTable.svelte';

	const { data } = $props();
</script>

<SellerRefundsTable
	refundsPromise={data.refundsPromise}
	reviewRefundFormData={data.reviewRefundFormData}
/>
