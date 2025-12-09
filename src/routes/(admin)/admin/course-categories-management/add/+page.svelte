<script lang="ts">
	import { goto } from '$app/navigation';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
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
				goto('/admin/course-categories-management');
			}
		}
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={() => history.back()}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button>
			<h1 class="text-header3 font-bold">Thêm danh mục khóa học mới</h1>
		</div>
		<p class="text-base-content/60">
			Tạo một danh mục khóa học mới để tổ chức và quản lý khóa học của bạn
		</p>
	</AnimatedDiv>
</div>

<div class="mx-auto max-w-xl">
	<!-- HERE IS THE FORM -->
	<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 pt-2" use:enhance>
		<FormInput
			name="name"
			label="Tên danh mục"
			placeholder="Nhập tên danh mục..."
			type="text"
			superForm={form}
			{errors}
		/>

		<FormInput
			name="description"
			label="Mô tả danh mục"
			placeholder="Nhập mô tả danh mục..."
			type="text"
			superForm={form}
			{errors}
		/>

		<button class="btn mt-2 w-full btn-primary" disabled={$submitting}>
			Thêm danh mục
			{#if $delayed}
				<span class="loading loading-spinner"></span>
			{/if}
		</button>
	</form>
</div>
