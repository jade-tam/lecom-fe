<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import { formatDateTime, formatVND } from '$lib/utils/converters';
	import CustomerWalletTransactionsTable from './(components)/CustomerWalletTransactionsTable.svelte';

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
			<h1 class="text-header3 font-bold">Ví cửa tôi</h1>
		</div>
		<p class="text-base-content/60">Theo dõi số dư ví và lịch sử giao dịch của bạn tại đây.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<a href={resolve('/wallet/withdraw')} class="btn btn-success">
			<span class="icon-[mingcute--bank-line] text-xl"></span>Rút tiền về tài khoản ngân hàng</a
		>
	</AnimatedDiv>
</div>

<div class="flex flex-col gap-2 max-md:grid-cols-1">
	<AnimatedDiv
		animateVars={{ translateY: 16, delay: 0.1 }}
		class="col-span-3 flex flex-col gap-2 max-md:col-span-1"
	>
		{#await data.balancePromise then balance}
			{#if balance}
				<div class="flex flex-col rounded-box border bg-base-100 p-4">
					<div>
						<h2 class="text-header3 mb-2 flex items-center gap-2">
							<span class="icon-[mingcute--wallet-3-fill] text-lg"></span>Số dư khả dụng
						</h2>
						<p class="stat-value my-2 font-serif font-bold text-success-content">
							<strong class="font-serif text-4xl font-bold">{formatVND(balance.balance)}</strong>
						</p>
					</div>

					<div class="divider my-1"></div>

					<div class="mb-4">
						<div class=" text-secondary-content">
							Tổng số tiền đã chi: <strong class="font-serif text-lg font-bold">
								{formatVND(balance.totalSpent)}
							</strong>
						</div>
						<div class=" mt-1 text-info-content">
							Tổng số tiền đã rút: <strong class="font-serif text-lg font-bold">
								{formatVND(balance.totalWithdrawn)}
							</strong>
						</div>
					</div>

					<div class="text-xs text-base-content/60">
						Cập nhật lần cuối lúc {formatDateTime(balance.lastUpdated)}
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
			<CustomerWalletTransactionsTable
				walletTransactionsDataPromise={data.walletTransactionsDataPromise}
			/>
		</div>
	</AnimatedDiv>
</div>
