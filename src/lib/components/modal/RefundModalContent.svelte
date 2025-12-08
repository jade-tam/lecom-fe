<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { createRefundSchema, type CreateRefundSchema } from '$lib/schemas/refundSchema';
	import { refundReasonTypeOptions } from '$lib/types/Refund';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormInput from '../ui/FormInput.svelte';
	import FormMediaInput from '../ui/FormMediaInput.svelte';
	import FormSelect from '../ui/FormSelect.svelte';
	import FormTextArea from '../ui/FormTextArea.svelte';

	const { dataForm, onFormActionSuccess } = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset } =
		superForm<
			CreateRefundSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			validators: zod4Client(createRefundSchema),
			invalidateAll: false
		});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
			onFormActionSuccess?.();
			goto(resolve('/(authenticated)/refunds'));
		}
	});
</script>

<form action="?/createRefund" method="POST" use:enhance>
	<h3 class="">Yêu cầu trả hàng hoàn tiền</h3>
	<p class="mt-2 text-sm text-base-content/70">
		Bạn có thể yêu cầu hoàn tiền trong 7 ngày sau khi nhận hàng nếu gặp phải vấn đề với sản phẩm đã
		nhận được.
	</p>
	<FormSelect
		label="Lý do trả hàng"
		placeholder="Lý do trả hàng"
		name="reasonType"
		options={refundReasonTypeOptions}
		superForm={form}
		{errors}
	/>
	<FormTextArea
		label="Mô tả thêm về lý do trả hàng"
		placeholder="Vui lòng mô tả lý do bạn muốn trả hàng..."
		name="reasonDescription"
		superForm={form}
		{errors}
	/>
	<FormInput
		label="Mã đơn hàng"
		placeholder="Mã đơn hàng"
		name="orderId"
		superForm={form}
		hidden
		{errors}
	/>
	<FormMediaInput
		label="Hình ảnh hoặc video minh chứng"
		aspectRatio="16:9"
		buttonClass="h-24 w-full"
		name="attachmentUrls"
		superForm={form}
		{errors}
	/>
	<div class="modal-action">
		<button type="submit" class="btn btn-primary" disabled={$submitting}
			>Gửi yêu cầu
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
