<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { cancelOrderSchema, type CancelOrderSchema } from '$lib/schemas/cancelOrderSchema';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormInput from '../ui/FormInput.svelte';
	import FormTextArea from '../ui/FormTextArea.svelte';

	const { dataForm, onFormActionSuccess } = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset } =
		superForm<
			CancelOrderSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			validators: zod4Client(cancelOrderSchema),
			invalidateAll: false
		});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
			onFormActionSuccess?.();
			if($message.toastData.type === 'success') {
				reset();
				invalidateAll();
			}
		}
	});
</script>

<form action="?/cancelOrder" method="POST" use:enhance>
	<h3 class="">Hủy đơn hàng</h3>
	<p class="mt-2 text-sm text-base-content/70">
		Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng.
	</p>
	<FormInput
		label="Mã đơn hàng"
		placeholder="Mã đơn hàng"
		name="orderId"
		superForm={form}
		hidden
		{errors}
	/>
	<FormTextArea
		label="Lý do hủy đơn hàng"
		placeholder="Vui lòng mô tả lý do bạn muốn hủy đơn hàng..."
		name="cancelReason"
		superForm={form}
		{errors}
	/>
	<div class="modal-action">
		<button type="submit" class="btn btn-primary" disabled={$submitting}
			>Hủy đơn hàng
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
