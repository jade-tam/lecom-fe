<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import AdminReviewShopWithdrawalsTable from './(components)/AdminReviewShopWithdrawalsTable.svelte';

	const { data, form } = $props();
</script>

<div class="my-2 flex flex-wrap justify-between gap-2">
	<AnimatedDiv animateVars={{ translateX: -20 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Duyệt yêu cầu rút tiền từ cửa hàng</h1>
		</div>
		<p class="text-base-content/60">
			Xem và xét duyệt các yêu cầu rút tiền đang chờ xử lý từ các cửa hàng.
		</p>
	</AnimatedDiv>
</div>

<AdminReviewShopWithdrawalsTable withdrawalsPromise={data.shopWithdrawalsPromise} />
