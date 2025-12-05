<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import {
		createCommunityPostSchema,
		type CreateCommunityPostSchema
	} from '$lib/schemas/communityPostSchema';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import TipTapRichTextEditor from '../ui/data-input/TipTapRichTextEditor.svelte';

	const { dataForm } = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<
			CreateCommunityPostSchema,
			{
				toastData: ToastData;
			}
		>(dataForm, {
			validators: zod4Client(createCommunityPostSchema)
		});

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);

			if ($message.toastData.type === 'success') {
				goto(resolve('/community/'));
			}
		}
	});
</script>

<form method="POST" class="" use:enhance>
	<FormInput
		name="title"
		label="Tiêu đề bài viết"
		placeholder="Nhập tiêu đề bài viết..."
		type="text"
		superForm={form}
		{errors}
		class="mb-2 font-serif font-bold"
	/>
	<FormInput name="body" label="Nội dung" type="text" superForm={form} {errors} hidden />
	<TipTapRichTextEditor bind:content={$form.body} />
	{#if $errors['body']}
		{#each $errors['body'] as error}
			<p class="mt-1 text-error">{error}</p>
		{/each}
	{/if}
	<div class="flex justify-end">
		<button type="submit" class="btn mt-4 btn-primary" disabled={$submitting}>
			{#if $submitting}Đang gửi...{:else}Tạo bài viết{/if}
			{#if $delayed}
				<span class="loading loading-sm loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
