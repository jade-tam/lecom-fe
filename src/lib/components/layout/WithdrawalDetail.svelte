<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import { withdrawalStatusOptions, type WithdrawalDetail } from '$lib/types/Withdrawal';
	import { getWithdrawalStatusClass } from '$lib/utils/classComposer';
	import {
		formatDate,
		formatDateTime,
		formatVND,
		getTitleFromOptionList
	} from '$lib/utils/converters';
	import AnimatedDiv from '../animate/AnimatedDiv.svelte';

	const { withdrawal }: { withdrawal: WithdrawalDetail } = $props();

	function handleBack() {
		history.back();
	}
</script>

<div class="mt-2 mb-2 flex flex-wrap items-center justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex items-center gap-4">
		<button class="btn btn-sm" aria-label="Quay lại" onclick={handleBack}>
			<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
		</button>
		<h1 class="text-2xl font-bold">
			Mã yêu cầu: {withdrawal.id}
		</h1>
		<span class={`ml-2 badge shrink-0 ${getWithdrawalStatusClass(withdrawal.status)}`}>
			{getTitleFromOptionList(withdrawal.status, withdrawalStatusOptions)}
		</span>
	</AnimatedDiv>
</div>

<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
	<!-- Thông tin shop -->
	<AnimatedDiv animateVars={{ translateY: 16 }} class="rounded-box border bg-base-100 p-4">
		<h2 class="mb-2 text-lg font-bold">Thông tin cửa hàng</h2>
		<div class="flex items-center gap-3">
			<Image
				src={withdrawal.shop.shopAvatar}
				alt={withdrawal.shop.shopName}
				class="h-12 w-12 rounded-full"
			/>
			<div>
				<p class="font-bold">{withdrawal.shop.shopName}</p>
				<p class="text-xs text-base-content/60">ID: {withdrawal.shop.shopId}</p>
			</div>
		</div>
	</AnimatedDiv>

	<!-- Thông tin ngân hàng -->
	<AnimatedDiv animateVars={{ translateY: 16 }} class="rounded-box border bg-base-100 p-4">
		<h2 class="mb-2 text-lg font-bold">Thông tin ngân hàng</h2>
		<div class="flex flex-col gap-2">
			<p><span class="font-semibold">Tên ngân hàng:</span> {withdrawal.bank.bankName}</p>
			<p><span class="font-semibold">Số tài khoản:</span> {withdrawal.bank.bankAccountNumber}</p>
			<p><span class="font-semibold">Chủ tài khoản:</span> {withdrawal.bank.bankAccountName}</p>
			<p><span class="font-semibold">Chi nhánh:</span> {withdrawal.bank.bankBranch}</p>
		</div>
	</AnimatedDiv>
</div>

<!-- Thông tin rút tiền -->
<AnimatedDiv animateVars={{ translateY: 16 }} class="mt-2 rounded-box border bg-base-100 p-4">
	<h2 class="mb-2 text-lg font-bold">Chi tiết yêu cầu rút tiền</h2>
	<div class="flex flex-col gap-2">
		<div class="flex justify-between">
			<span class="font-semibold">Số tiền rút</span>
			<span class="font-serif font-bold text-success-content text-lg">{formatVND(withdrawal.amount)}</span>
		</div>
		<div class="flex justify-between">
			<span class="font-semibold">Thời gian yêu cầu</span>
			<span>{formatDateTime(withdrawal.requestedAt)}</span>
		</div>
		<div class="flex justify-between">
			<span class="font-semibold">Thời gian duyệt</span>
			<span>
				{#if withdrawal.approvedAt}
					{formatDateTime(withdrawal.approvedAt)}
				{:else}
					<span class="text-base-content/60 italic">---</span>
				{/if}
			</span>
		</div>
		<div class="flex justify-between">
			<span class="font-semibold">Thời gian hoàn tất</span>
			<span>
				{#if withdrawal.completedAt}
					{formatDate(withdrawal.completedAt)}
				{:else}
					<span class="text-base-content/60 italic">---</span>
				{/if}
			</span>
		</div>
		<div class="flex justify-between">
			<span class="font-semibold">Ghi chú</span>
			<span class="text-sm text-secondary-content/70">
				{#if withdrawal.note}
					{withdrawal.note}
				{:else}
					<span class="text-base-content/60 italic">---</span>
				{/if}
			</span>
		</div>
		<div class="flex justify-between">
			<span class="font-semibold">Ghi chú admin</span>
			<span class="text-sm text-error-content/70">
				{#if withdrawal.adminNote}
					{withdrawal.adminNote}
				{:else}
					<span class="text-base-content/60 italic">---</span>
				{/if}
			</span>
		</div>
		{#if withdrawal.rejectionReason}
			<div class="flex justify-between">
				<span class="font-semibold text-error-content">Lý do từ chối</span>
				<span class="text-error-content">{withdrawal.rejectionReason}</span>
			</div>
		{/if}
	</div>
</AnimatedDiv>
