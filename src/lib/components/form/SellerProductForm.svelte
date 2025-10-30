<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormMultiImageInput from '$lib/components/ui/FormMultiImageInput.svelte';
	import FormSelect from '$lib/components/ui/FormSelect.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import { createProductSchema, type CreateProductSchema } from '$lib/schemas/createProductSchema';
	import type { Category } from '$lib/types/Category';
	import { getProductStatusBadgeClass } from '$lib/utils/classComposer';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const {
		dataForm,
		categories
	}: {
		dataForm: any;
		categories: Category[];
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted } = superForm<
		CreateProductSchema,
		ToastData
	>(dataForm, {
		dataType: 'json',
		validators: zod4Client(createProductSchema),
		onUpdated: ({ form }) => {
			if (form.message?.type === 'success') {
				goto('/seller/products');
			}
		}
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<form method="POST" class="mt-2 h-fit w-full rounded-box border bg-base-100 p-4" use:enhance>
	<div class="flex items-center justify-between">
		<h1 class="text-header3 font-bold">Basic Information</h1>
		<div class="badge {getProductStatusBadgeClass($form['status'])}">{$form['status']}</div>
	</div>

	<FormInput
		name="name"
		label="Product Name"
		placeholder="Enter name here..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormTextArea
		name="description"
		label="Description"
		placeholder="Enter description here..."
		superForm={form}
		{errors}
	/>

	<FormSelect
		options={categories.map((cat) => ({
			title: cat.name,
			value: cat.id
		}))}
		class="max-w-[360px]"
		name="categoryId"
		label="Product Category"
		superForm={form}
		{errors}
	/>

	<h1 class="text-header3 mt-8 font-bold">Product Media</h1>

	<FormMultiImageInput name="images" label="Product Images" superForm={form} {errors} />

	<h1 class="text-header3 mt-8 font-bold">Stock & Pricing</h1>

	<div class="grid grid-cols-2 gap-4">
		<FormInput
			name="price"
			label="Price (đ)"
			placeholder="Enter price here..."
			type="number"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="stock"
			label="Stock Quantity"
			placeholder="Enter stock quantity here..."
			type="number"
			superForm={form}
			{errors}
		/>
	</div>

	<div class="mt-4 flex justify-end gap-2">
		<button
			class="btn btn-secondary"
			type="submit"
			name="status"
			value="Draft"
			disabled={$submitting}
		>
			Save as Draft
			{#if $delayed}
				<span class="loading loading-infinity"></span>
			{/if}
		</button>
		<button
			class="btn btn-primary"
			type="submit"
			name="status"
			value="Publish"
			disabled={$submitting}
		>
			Publish Product
			{#if $delayed}
				<span class="loading loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
