<script lang="ts">
	import { reviewRefundSchema, type ReviewRefundSchema } from '$lib/schemas/refundSchema';
	import { refundReasonTypeOptions, type Refund } from '$lib/types/Refund';
	import { formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormInput from '../ui/FormInput.svelte';
	import FormTextArea from '../ui/FormTextArea.svelte';
	import Image from '../ui/Image.svelte';

	const {
		dataForm,
		refund,
		isAdminView,
		onFormActionSuccess
	}: { dataForm: any; refund: Refund; isAdminView?: boolean; onFormActionSuccess?: () => void } =
		$props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset } =
		superForm<
			ReviewRefundSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			id: 'refund-form-' + refund.id,
			validators: zod4Client(reviewRefundSchema)
		});

	$effect(() => {
		$form.refundId = refund.id;
	});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
			setTimeout(() => {
				onFormActionSuccess?.();
			}, 500);
		}
	});
</script>

<form action="?/reviewRefund" method="POST" use:enhance>
	<h3 class="">Xử lý yêu cầu trả hàng hoàn tiền</h3>
	<p class="mt-2 text-sm text-base-content/70">
		Kiểm tra các thông tin liên quan đến yêu cầu hoàn tiền trước khi xác nhận.
	</p>

	<div class="mt-4 mb-2 rounded-box bg-base-200 p-4">
		<h4 class="mb-1 text-base font-bold">Yêu cầu bởi</h4>
		<p class="font-bold text-info-content">
			{refund.requestedByName}
		</p>

		<h4 class="mt-4 mb-1 text-base font-bold">Lý do hoàn tiền</h4>
		<p>
			<strong class="text-error-content"
				>{getTitleFromOptionList(refund.reasonType, refundReasonTypeOptions)}</strong
			>
			{#if refund.reasonDescription}{/if}
		</p>
		<p class="mt-2 text-base-content/70">Chi tiết: {refund.reasonDescription}</p>
		<div class="mt-2">
			<span class="font-bold text-base-content/70">Minh chứng:</span>
			<Image
				src={refund.attachmentUrls}
				alt="Refund Evidence"
				class="mt-2 h-48 w-full rounded-box object-cover"
			/>
		</div>
		<div class="mt-2 text-xs text-base-content/70">
			Loại hoàn tiền: <strong class="text-success-content"
				>{refund.type === 'Full' ? 'Hoàn toàn bộ' : 'Một phần'}</strong
			>
			<br />
			Số tiền yêu cầu:
			<strong class="font-serif text-lg font-bold text-success-content"
				>{formatVND(refund.refundAmount)}</strong
			>
		</div>
	</div>

	{#if isAdminView}
		<h4 class=" mt-4 text-base">Phản hồi của cửa hàng</h4>

		<p class="mt-2 flex items-center gap-2 text-lg text-success-content">
			<span class="icon-[mingcute--checks-fill]"></span>Đã chấp thuận
		</p>
	{/if}

	<h4 class=" mt-4 text-base">Phản hồi của {isAdminView ? 'quản trị viên' : 'cửa hàng'}</h4>

	<div class="mt-2 flex items-center gap-4">
		<label class="flex items-center gap-2">
			<input
				type="radio"
				name="approve"
				value={true}
				bind:group={$form.approve}
				checked={$form.approve === true}
				class="radio radio-success"
			/>
			<span>Chấp thuận</span>
		</label>
		<label class="flex items-center gap-2">
			<input
				type="radio"
				name="approve"
				value={false}
				bind:group={$form.approve}
				checked={$form.approve === false}
				class="radio radio-error"
			/>
			<span>Từ chối</span>
		</label>
	</div>
	{#if $errors['approve']}
		{#each $errors['approve'] as string[] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}

	{#if $form.approve === false}
		<FormTextArea
			label="Lý do từ chối hoàn tiền"
			placeholder="Vui lòng cung cấp lý do bạn muốn từ chối hoàn tiền..."
			name="rejectReason"
			superForm={form}
			{errors}
		/>
	{/if}

	<FormInput
		label="Mã refund"
		placeholder="Mã refund"
		name="refundId"
		superForm={form}
		hidden
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
