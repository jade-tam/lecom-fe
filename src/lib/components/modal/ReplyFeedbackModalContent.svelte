<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { replyFeedbackSchema, type ReplyFeedbackSchema } from '$lib/schemas/replyFeedbackSchema';
	import type { Feedback } from '$lib/types/Feedback';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormInput from '../ui/FormInput.svelte';
	import FormTextArea from '../ui/FormTextArea.svelte';
	import Rating from '../ui/data-input/Rating.svelte';

	const {
		dataForm,
		feedback,
		type,
		onFormActionSuccess
	}: {
		dataForm: any;
		feedback: Feedback;
		type: 'update' | 'create';
		onFormActionSuccess?: () => void;
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, isTainted, reset } = superForm<
		ReplyFeedbackSchema,
		{
			toastData: ToastData;
		}
	>(dataForm, {
		id: 'reply-feedback-form-' + feedback.id,
		validators: zod4Client(replyFeedbackSchema),
		invalidateAll: false
	});

	$effect(() => {
		$form.feedbackId = feedback.id;
		$form.replyContent = feedback.reply?.content ?? '';
		$form.type = type;
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

<form action="?/replyFeedback" method="POST" use:enhance>
	<h3>Phản hồi đánh giá</h3>
	<p class="mt-2 text-sm text-base-content/70">
		Vui lòng cung cấp phản hồi chi tiết cho đánh giá này.
	</p>

	<div class="mt-4 mb-2 rounded-box bg-base-200 p-4">
		<h4 class="mb-1 text-base font-bold">Đánh giá từ</h4>
		<p class="font-bold text-info-content">
			{feedback.userName}
		</p>

		<h4 class="mt-4 mb-1 text-base font-bold">Nội dung đánh giá</h4>
		<p class="mt-2">
			{feedback.content}
		</p>

		<div class="mt-2 text-xs text-base-content/70">
			Xếp hạng:
			<Rating defaultValue={feedback.rating} readonly />
		</div>
	</div>

	<h4 class="mt-4 text-base">Phản hồi của bạn</h4>

	<FormTextArea
		label="Nội dung phản hồi"
		placeholder="Vui lòng cung cấp phản hồi để trả lời đánh giá này..."
		name="replyContent"
		superForm={form}
		{errors}
	/>

	<FormInput
		label="Mã đánh giá"
		placeholder="Mã đánh giá"
		name="feedbackId"
		superForm={form}
		hidden
		{errors}
	/>

	<FormInput
		label="Loại phản hồi"
		placeholder="Loại phản hồi"
		name="type"
		superForm={form}
		hidden
		{errors}
	/>

	<div class="modal-action">
		<button type="submit" class="btn btn-primary" disabled={$submitting}
			>Gửi phản hồi
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
