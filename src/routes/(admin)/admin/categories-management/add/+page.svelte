<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import { addCategorySchema, type AddCategorySchema } from '$lib/schemas/addCategorySchema.js';
	import type { ToastData } from '$lib/utils/showToast.js';
	import showToast from '$lib/utils/showToast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm<
		AddCategorySchema,
		ToastData
	>(data.form, {
		validators: zod4Client(addCategorySchema),
		onUpdated: ({ form }) => {
			if (form.message?.type === 'success') {
				goto('/admin/categories-management');
			}
		}
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<div class="mx-auto max-w-xl">
	<div class="my-2 flex justify-between">
		<div class="flex gap-3">
			<a
				href="/admin/categories-management"
				aria-label="return to category list"
				class="btn btn-square"
			>
				<span class="icon-[fa7-solid--arrow-left]"></span>
			</a>
			<h2>Add new category</h2>
		</div>
	</div>

	<!-- HERE IS THE FORM -->
	<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 pt-2" use:enhance>
		<FormInput
			name="name"
			label="Category Name"
			placeholder="Enter name here..."
			type="text"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="description"
			label="Category Description"
			placeholder="Enter description here..."
			type="text"
			superForm={form}
			{errors}
		/>

		<button class="btn mt-2 w-full btn-primary" disabled={$submitting}>
			Add
			{#if $delayed}
				<span class="loading loading-spinner"></span>
			{/if}
		</button>
	</form>
</div>
