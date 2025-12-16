<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { reviewWithdrawalSchema, type ReviewWithdrawalSchema } from '$lib/schemas/withdrawSchema';
	import { withdrawalStatusOptions, type WithdrawalDetail } from '$lib/types/Withdrawal';
	import { getWithdrawalStatusClass } from '$lib/utils/classComposer';
	import { formatDateTime, formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormTextArea from '../ui/FormTextArea.svelte';
	import Image from '../ui/Image.svelte';

	const {
		dataForm,
		withdrawal,
		reviewType = 'shop',
		onFormActionSuccess
	}: {
		dataForm: any;
		withdrawal: WithdrawalDetail;
		reviewType?: 'customer' | 'shop';
		onFormActionSuccess?: () => void;
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset } =
		superForm<
			ReviewWithdrawalSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			id: 'withdrawal-form-' + withdrawal.id,
			validators: zod4Client(reviewWithdrawalSchema),
			invalidateAll: false
		});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
			onFormActionSuccess?.();
			if ($message.toastData.type === 'success') {
				reset();
				invalidateAll();
			}
		}
	});
</script>

<form action="?/reviewWithdrawal" method="POST" use:enhance>
	<h3 class="">Xử lý yêu cầu rút tiền</h3>
	<p class="mt-2 text-sm text-base-content/70">
		Kiểm tra các thông tin liên quan đến yêu cầu rút tiền trước khi xác nhận.
	</p>

	<div class="mt-4 mb-2 rounded-box bg-base-200 p-4">
		<h4 class="mb-2 font-bold">Thông tin yêu cầu</h4>
		<div class="flex flex-col gap-1">
			<p>
				<strong class="text-info-content">Mã yêu cầu:</strong>
				{withdrawal.id}
			</p>
			<p>
				<strong class="text-info-content">Số tiền rút:</strong>
				<span class="font-serif text-lg font-bold text-success-content"
					>{formatVND(withdrawal.amount)}</span
				>
			</p>
			<p>
				<strong class="text-info-content">Trạng thái:</strong>
				<span class="ml-1 badge badge-sm {getWithdrawalStatusClass(withdrawal.status, 'badge')}">
					{getTitleFromOptionList(withdrawal.status, withdrawalStatusOptions)}
				</span>
			</p>
			<p>
				<strong class="text-info-content">Thời gian yêu cầu:</strong>
				<span class="font-semibold">{formatDateTime(withdrawal.requestedAt)}</span>
			</p>
			{#if withdrawal.note}
				<p>
					<strong class="text-info-content">Ghi chú:</strong>
					{withdrawal.note}
				</p>
			{/if}
		</div>
		<div class="divider my-2"></div>
		<h4 class="mb-2 font-bold">Thông tin ngân hàng</h4>
		<div class="flex flex-col gap-1">
			<p><strong class="text-info-content">Tên ngân hàng:</strong> {withdrawal.bank.bankName}</p>
			<p>
				<strong class="text-info-content">Số tài khoản:</strong>
				{withdrawal.bank.bankAccountNumber}
			</p>
			<p>
				<strong class="text-info-content">Chủ tài khoản:</strong>
				{withdrawal.bank.bankAccountName}
			</p>
			<p><strong class="text-info-content">Chi nhánh:</strong> {withdrawal.bank.bankBranch}</p>
		</div>
		{#if withdrawal.shop}
			<div class="divider my-2"></div>
			<h4 class="mb-2 font-bold">Thông tin cửa hàng</h4>
			<div class="flex items-center gap-2">
				<Image
					src={withdrawal.shop.shopAvatar}
					alt={withdrawal.shop.shopName}
					class="h-10 w-10 rounded-full"
				/>
				<div>
					<p class="font-bold">{withdrawal.shop.shopName}</p>
					<p class="text-xs text-base-content/60">ID: {withdrawal.shop.shopId}</p>
				</div>
			</div>
		{/if}
		{#if withdrawal.customer}
			<div class="divider my-2"></div>
			<h4 class="mb-1 font-bold">Thông tin khách hàng</h4>
			<div class="flex items-center gap-2">
				<Image
					src={withdrawal.customer.avatar}
					alt={withdrawal.customer.userName}
					class="h-10 w-10 rounded-full"
				/>
				<div>
					<p class="font-bold">{withdrawal.customer.userName}</p>
					<p class="text-xs text-base-content/60">ID: {withdrawal.customer.customerId}</p>
				</div>
			</div>
		{/if}
	</div>

	<h4 class="mt-4 text-base">
		Phản hồi của {reviewType === 'shop' ? 'quản trị viên' : 'quản trị viên (khách hàng)'}
	</h4>

	<div class="mt-2 flex items-center gap-4">
		<label class="flex items-center gap-2">
			<input
				type="radio"
				name="action"
				value="approve"
				bind:group={$form.action}
				checked={$form.action === 'approve'}
				class="radio radio-success"
			/>
			<span>Chấp thuận</span>
		</label>
		<label class="flex items-center gap-2">
			<input
				type="radio"
				name="action"
				value="reject"
				bind:group={$form.action}
				checked={$form.action === 'reject'}
				class="radio radio-error"
			/>
			<span>Từ chối</span>
		</label>
	</div>
	{#if $errors['action']}
		{#each $errors['action'] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}

	{#if $form.action === 'reject'}
		<FormTextArea
			label="Lý do từ chối"
			placeholder="Vui lòng cung cấp lý do từ chối..."
			name="reason"
			superForm={form}
			{errors}
		/>
	{/if}

	<FormTextArea
		label="Ghi chú (không bắt buộc)"
		placeholder="Thêm ghi chú cho yêu cầu này..."
		name="note"
		superForm={form}
		{errors}
	/>

	<div class="modal-action">
		<button type="submit" class="btn btn-primary" disabled={$submitting}
			>Xác nhận
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
