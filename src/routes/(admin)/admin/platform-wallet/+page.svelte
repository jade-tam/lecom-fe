<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import { formatDateTime, formatVND } from '$lib/utils/converters';
	import PlatformWalletTransactionsTable from './(components)/PlatformWalletTransactionsTable.svelte';

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
			<h1 class="text-header3 font-bold">Ví nền tảng</h1>
		</div>
		<p class="text-base-content/60">Theo dõi số dư ví và lịch sử biến động số dư ví nền tảng.</p>
	</AnimatedDiv>

	<!-- <AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<a href={resolve('/wallet/withdraw')} class="btn btn-success">
			<span class="icon-[mingcute--bank-line] text-xl"></span>Rút tiền về tài khoản ngân hàng</a
		>
	</AnimatedDiv> -->
</div>

<div class="flex flex-col gap-2 max-md:grid-cols-1">
	<AnimatedDiv
		animateVars={{ translateY: 16, delay: 0.1 }}
		class="col-span-3 flex flex-col gap-2 max-md:col-span-1"
	>
		{#await data.platformWalletPromise then balance}
			{#if balance}
				<div class="flex flex-col rounded-box border bg-base-100 p-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
					<div>
						<h2 class="text-header3 mb-2 flex items-center gap-2 text-success-content/70">
							<span class="icon-[mingcute--wallet-3-fill] text-lg"></span>Số dư khả dụng
						</h2>
						<p class=" font-serif font-bold text-success-content">
							<strong class="font-serif text-2xl font-bold">{formatVND(balance.balance)}</strong>
						</p>
					</div>

					<div>
						<h2 class="text-header3 mb-2 flex items-center gap-2 text-warning-content/70">
							<span class="icon-[mingcute--receive-money-fill] text-lg"></span>Tiền hoa hồng đã nhận
						</h2>
						<p class="font-serif text-2xl font-bold text-warning-content">
							{formatVND(balance.totalCommissionEarned)}
						</p>
					</div>

					<div>
						<h2 class="text-header3 mb-2 flex items-center gap-2 text-error-content/70">
							<span class="icon-[mingcute--refresh-anticlockwise-1-fill] text-lg"></span>Đã hoàn lại
						</h2>
						<p class="font-serif text-2xl font-bold text-error-content">
							{formatVND(balance.totalCommissionRefunded)}
						</p>
					</div>

					<div>
						<h2 class="text-header3 mb-2 flex items-center gap-2 text-success-content/70">
							<span class="icon-[mingcute--bank-line] text-lg"></span>Tổng số tiền đã rút
						</h2>
						<p class="font-serif text-2xl font-bold text-success-content">
							{formatVND(balance.totalPayout)}
						</p>
					</div>
				</div>

				<div class="divider my-2"></div>
					<div class="mb-2 grid grid-cols-2 gap-2 text-xs">
						<div class="text-base-content/60">
							Ngày tạo: <strong class="text-base-content">{formatDateTime(balance.createdAt)}</strong>
						</div>
						<div class="text-base-content/60">
							Cập nhật lần cuối: <strong class="text-base-content">{formatDateTime(balance.lastUpdated)}</strong>
						</div>
					</div>

					<div class="text-xs text-base-content/60">
						ID: <code class="text-xs">{balance.id}</code>
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
			<PlatformWalletTransactionsTable
				walletTransactionsDataPromise={data.walletTransactionsDataPromise}
			/>
		</div>
	</AnimatedDiv>
</div>
