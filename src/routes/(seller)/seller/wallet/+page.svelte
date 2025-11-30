<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import { formatDateTime, formatVND } from '$lib/utils/converters';
	import SellerWalletTransactionsTable from './(components)/SellerWalletTransactionsTable.svelte';

	const { data } = $props();

	$effect(() => {
		function logTransactions() {
			data.walletTransactionsDataPromise.then((transactions) => {
				console.log('Wallet Transactions:', transactions);
			});
		}
		logTransactions();
	});
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Ví cửa hàng</h1>
		</div>
		<p class="text-base-content/60">
			Ví cửa hàng hiển thị số dư, doanh thu và lịch sử giao dịch của shop.
		</p>
	</AnimatedDiv>

	<!-- <AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<SearchInput bind:value={table.globalFilter} />
	</AnimatedDiv> -->
</div>

<div class="flex flex-col gap-2 max-md:grid-cols-1">
	<AnimatedDiv
		animateVars={{ translateY: 16, delay: 0.1 }}
		class="col-span-3 flex flex-col gap-2 max-md:col-span-1"
	>
		{#await data.walletSummaryPromise then walletSummary}
			{#if walletSummary}
				<div class="flex flex-col rounded-box border bg-base-100 p-4">
					<div>
						<h2 class="text-header3 mb-2 flex items-center gap-2">
							<span class="icon-[mingcute--wallet-3-fill] text-lg"></span>Số dư khả dụng
						</h2>
						<p class="stat-value my-2 font-serif font-bold text-success-content">
							<strong class="font-serif text-4xl font-bold"
								>{formatVND(walletSummary.availableBalance)}</strong
							>
						</p>
						<p class="stat-desc text-warning-content">
							Đang tạm giữ: <strong class="font-serif font-bold"
								>{formatVND(walletSummary.pendingBalance)}</strong
							>
							(Tổng:
							<strong class="font-serif font-bold">????</strong>)
						</p>
					</div>

					<div class="divider my-1"></div>

					<div class="mb-4">
						<div class="stat-desc text-warning-content">
							Số tiền rút đang chờ duyệt: <strong class="font-serif font-bold">
								<!-- {formatVND(walletSummary.pendingWithdrawalAmount)} -->
								Không rõ????
							</strong>
						</div>
						<div class="stat-desc mt-1 text-success-content">
							Số dư đã rút: <strong class="font-serif font-bold">
								<!-- {formatVND(walletSummary.approvedWithdrawalAmount)} -->
								Không rõ????
							</strong>
						</div>
					</div>

					<div class="text-xs text-base-content/60">
						Cập nhật lần cuối lúc {formatDateTime(walletSummary.lastUpdated)}
					</div>
				</div>
			{:else}
				<EmptyPlaceholder text="Không thể tải thông tin ví cửa hàng." />
			{/if}
		{/await}
	</AnimatedDiv>

	<AnimatedDiv
		animateVars={{ translateY: 16, delay: 0.2 }}
		class="col-span-9 flex flex-col gap-2 max-md:col-span-1"
	>
		<div class="rounded-box border bg-base-100 p-4">
			<SellerWalletTransactionsTable
				walletTransactionsDataPromise={data.walletTransactionsDataPromise}
			/>
		</div>
	</AnimatedDiv>
</div>
