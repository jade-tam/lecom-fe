<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import AdminReviewCustomerWithdrawalsTable from './(components)/AdminReviewCustomerWithdrawalsTable.svelte';

	const { data, form } = $props();
</script>

<div class="my-2 flex flex-wrap justify-between gap-2">
	<AnimatedDiv animateVars={{ translateX: -20 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Duyệt yêu cầu rút tiền của khách hàng</h1>
		</div>
		<p class="text-base-content/60">
			Xem và xét duyệt các yêu cầu rút tiền đang chờ xử lý từ khách hàng.
		</p>
	</AnimatedDiv>
</div>

<AdminReviewCustomerWithdrawalsTable withdrawalsPromise={data.customerWithdrawalsPromise} />
