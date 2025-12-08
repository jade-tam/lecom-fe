<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		createProductFeedbackSchema,
		type CreateProductFeedbackSchema
	} from '$lib/schemas/orderFeedbackSchema';
	import type { OrderDetail } from '$lib/types/Order';
	import { formatVND } from '$lib/utils/converters';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import Rating from '../ui/data-input/Rating.svelte';
	import FormInput from '../ui/FormInput.svelte';
	import FormMultiImageInput from '../ui/FormMultiImageInput.svelte';
	import FormTextArea from '../ui/FormTextArea.svelte';
	import Image from '../ui/Image.svelte';

	const {
		dataForm,
		onFormActionSuccess,
		orderDetail
	}: {
		dataForm: any;
		onFormActionSuccess?: () => void;
		orderDetail: OrderDetail;
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset, submit } =
		superForm<
			CreateProductFeedbackSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			dataType: 'json',
			id: 'createOrderFeedbackForm-' + orderDetail.productId,
			validators: zod4Client(createProductFeedbackSchema),
			invalidateAll: false
		});

	function handleSubmit() {
		$form.productId = orderDetail.productId;
		submit();
	}

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
			onFormActionSuccess?.();
			invalidateAll();
			reset();
		}
	});
</script>

<form action="?/createOrderFeedback" method="POST" use:enhance>
	<h3 class="">Đánh giá sản phẩm</h3>
	<p class="mb-4 text-sm text-base-content/70">Hãy chia sẻ đánh giá của bạn về sản phẩm này.</p>
	{#if orderDetail}
		<div class="mb-4 flex items-center gap-4">
			<Image
				src={orderDetail.productImage ?? '/icons/product-placeholder.svg'}
				alt={orderDetail.productName ?? 'Sản phẩm'}
				class="h-32 w-32 rounded-field object-cover"
			/>
			<div>
				<h3 class="text-lg font-bold">{orderDetail.productName ?? 'Tên sản phẩm'}</h3>
				<p class="badge badge-sm badge-secondary">{orderDetail.productCategory ?? 'Không có'}</p>
				<p class="mt-1 text-sm">Số lượng: {orderDetail.quantity}</p>
				<p class="mt-1 text-sm">
					Đơn giá: <strong class="font-serif text-lg font-bold"
						>{formatVND(orderDetail.unitPrice)}</strong
					>
				</p>
				<p class="mt-1 text-sm">
					Thành tiền: <strong class="font-serif text-lg font-bold"
						>{formatVND(orderDetail.lineTotal)}</strong
					>
				</p>
			</div>
		</div>
	{/if}

	<fieldset class="mt-4 fieldset">
		<legend class="fieldset-legend">Đánh giá</legend>
		<div class="flex items-center gap-2">
			<Rating defaultValue={0} bind:value={$form.rating} />
			<input type="hidden" name="rating" value={$form.rating} />
		</div>
		{#if $errors.rating}
			{#each $errors.rating as error}
				<p class="text-error">{error}</p>
			{/each}
		{/if}
	</fieldset>
	<FormTextArea
		label="Nội dung đánh giá"
		placeholder="Vui lòng chia sẻ trải nghiệm của bạn về sản phẩm..."
		name="content"
		superForm={form}
		{errors}
	/>
	<FormMultiImageInput
		isUrlOnly
		name="images"
		label="Hình ảnh sản phẩm"
		superForm={form}
		{errors}
	/>
	<FormInput
		label="Mã sản phẩm"
		placeholder="Mã sản phẩm"
		name="productId"
		superForm={form}
		hidden
		{errors}
	/>

	<div class="modal-action">
		<button
			type="button"
			onclick={() => handleSubmit()}
			class="btn btn-primary"
			disabled={$submitting}
			>Gửi đánh giá
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
