<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormMultiImageInput from '$lib/components/ui/FormMultiImageInput.svelte';
	import FormSelect from '$lib/components/ui/FormSelect.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import { createProductSchema, type CreateProductSchema } from '$lib/schemas/createProductSchema';
	import type { Category } from '$lib/types/Category';
	import type { ProductStatus } from '$lib/types/Product';
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

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<CreateProductSchema, ToastData>(dataForm, {
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

	async function handleSubmit(status: ProductStatus) {
		// set status before submit
		$form.status = status;

		submit();
	}
</script>

<form method="POST" class="mt-2 h-fit w-full rounded-box border bg-base-100 p-4" use:enhance>
	<div class="flex items-center justify-between">
		<h1 class="text-header3 font-bold">Thông tin cơ bản</h1>
		<div class="badge {getProductStatusBadgeClass($form['status'])}">{$form['status']}</div>
	</div>

	<FormInput
		name="name"
		label="Tên sản phẩm"
		placeholder="Nhập tên sản phẩm..."
		type="text"
		superForm={form}
		{errors}
	/>

	<FormTextArea
		name="description"
		label="Mô tả sản phẩm"
		placeholder="Nhập mô tả sản phẩm..."
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
		label="Danh mục sản phẩm"
		superForm={form}
		{errors}
	/>

	<h1 class="text-header3 mt-8 font-bold">Hình ảnh sản phẩm</h1>

	<FormMultiImageInput name="images" label="Ảnh sản phẩm" superForm={form} {errors} />

	<h1 class="text-header3 mt-8 font-bold">Kho & Giá bán</h1>

	<div class="grid grid-cols-2 gap-4">
		<FormInput
			name="price"
			label="Giá bán (đ)"
			placeholder="Nhập giá bán..."
			type="number"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="stock"
			label="Số lượng kho"
			placeholder="Nhập số lượng kho..."
			type="number"
			superForm={form}
			{errors}
		/>
	</div>

	<div class="mt-4 flex justify-end gap-2">
		<button
			class="btn btn-secondary"
			type="button"
			onclick={() => handleSubmit('Draft')}
			disabled={$submitting}
		>
			Lưu sản phẩm
			{#if $delayed}
				<span class="loading loading-infinity"></span>
			{/if}
		</button>
		<!-- <button
			class="btn btn-primary"
			type="button"
			onclick={() => handleSubmit('Published')}
			disabled={$submitting}
		>
			Lưu sản phẩm
			{#if $delayed}
				<span class="loading loading-infinity"></span>
			{/if}
		</button> -->
	</div>
</form>
