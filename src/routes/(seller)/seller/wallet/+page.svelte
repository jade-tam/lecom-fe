<script lang="ts">
	import { resolve } from '$app/paths';
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

<div class="my-2 flex flex-wrap items-end justify-between gap-2">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Ví cửa hàng</h1>
		</div>
		<p class="text-base-content/60">
			Ví cửa hàng hiển thị số dư, doanh thu và lịch sử giao dịch của shop.
		</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<a href={resolve('/seller/wallet/withdraw')} class="btn btn-success">
			<span class="icon-[mingcute--bank-line] text-xl"></span>Rút tiền về tài khoản ngân hàng</a
		>
	</AnimatedDiv>
</div>

<div class="flex flex-col gap-2 max-md:grid-cols-1">
	<AnimatedDiv
		animateVars={{ translateY: 16, delay: 0.1 }}
		class="col-span-3 flex flex-col gap-2 max-md:col-span-1"
	>
		{#await data.walletSummaryPromise then walletSummary}
			{#if walletSummary}
				<div class="flex flex-col rounded-box border bg-base-100 p-4">
					<div class="flex flex-col gap-1">
						<h2 class="text-header3 mb-2 flex items-center gap-2">
							<span class="icon-[mingcute--wallet-3-fill] text-lg"></span>Số dư khả dụng
						</h2>
						<p class="stat-value my-2 font-serif font-bold text-success-content">
							<strong class="font-serif text-4xl font-bold"
								>{formatVND(walletSummary.availableBalance)}</strong
							>
						</p>
						<p class="text-sm text-warning-content">
							Tổng:
							<strong class="font-serif font-bold">{formatVND(walletSummary.totalEarned)}</strong>
							(Đang tạm giữ:
							<strong class="font-serif font-bold">{formatVND(walletSummary.pendingBalance)}</strong
							>)
						</p>
						<p class="text-sm text-warning-content">
							Số đơn hàng đang xử lý:
							<strong class="font-bold">{walletSummary.pendingOrdersCount} Đơn</strong>
						</p>
					</div>

					<div class="divider my-1"></div>

					<div class="mb-4">
						<div class="text-sm text-warning-content">
							Số tiền rút đang chờ duyệt: <strong class="font-serif font-bold">
								{formatVND(walletSummary.pendingWithdrawalAmount)}
							</strong>
						</div>
						<div class="mt-1 text-sm text-success-content">
							Số dư đã rút: <strong class="font-serif font-bold">
								{formatVND(walletSummary.approvedWithdrawalAmount)}
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
