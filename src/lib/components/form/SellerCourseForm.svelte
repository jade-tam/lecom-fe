<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import FormSelect from '$lib/components/ui/FormSelect.svelte';
	import FormTextArea from '$lib/components/ui/FormTextArea.svelte';
	import {
		createCourseSchema,
		updateCourseSchema,
		type CreateCourseSchema,
		type UpdateCourseSchema
	} from '$lib/schemas/courseSchema';
	import type { Category } from '$lib/types/Category';
	import { getCourseActiveStatusBadgeClass } from '$lib/utils/classComposer';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormMediaInput from '../ui/FormMediaInput.svelte';
	import { courseActiveStatusOptions } from '$lib/types/Course';

	const {
		dataForm,
		categories,
		mode
	}: {
		dataForm: any;
		categories: Promise<Category[]>;
		mode: 'create' | 'update';
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<CreateCourseSchema & UpdateCourseSchema, ToastData>(dataForm, {
			validators:
				mode === 'create' ? zod4Client(createCourseSchema) : zod4Client(updateCourseSchema),
			onUpdated: ({ form }) => {
				if (form.message?.type === 'success') {
					goto('/seller/courses');
				}
			}
		});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<form
	method="POST"
	class="mt-2 h-fit w-full rounded-box border bg-base-100 p-4"
	use:enhance
	action={mode === 'update' ? '?/updateCourse' : ''}
>
	<div class="flex items-center justify-between">
		<h1 class="text-header3 font-bold">Basic Information</h1>
		{#if $form.active}
			<div class="badge {getCourseActiveStatusBadgeClass($form.active)}">
				{courseActiveStatusOptions.find((option) => option.value === $form.active)?.title}
			</div>
		{/if}
	</div>

	<div class="flex gap-4">
		<div>
			<FormMediaInput
				label="Course Thumbnail"
				aspectRatio="16:9"
				buttonClass="h-48"
				name="courseThumbnail"
				superForm={form}
				{errors}
			/>
		</div>
		<div class="flex grow flex-col">
			<FormInput
				name="title"
				label="Course Title"
				placeholder="Enter title here..."
				type="text"
				superForm={form}
				{errors}
			/>
			{#await categories}
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Course Category</legend>
					<div class="h-10 w-90 skeleton rounded-field"></div>
				</fieldset>
			{:then categories}
				<FormSelect
					options={categories.map((cat) => ({
						title: cat.name,
						value: cat.id
					}))}
					class="max-w-[300px]"
					name="categoryId"
					label="Course Category"
					superForm={form}
					{errors}
				/>
			{/await}
		</div>
	</div>

	<FormTextArea
		name="summary"
		label="Summary"
		placeholder="Enter summary here..."
		superForm={form}
		{errors}
	/>

	<div class="mt-4 flex justify-end gap-2">
		<button class="btn btn-primary" type="submit" disabled={$submitting || !isTainted($tainted)}>
			{mode === 'create' ? 'Create course' : 'Save changes'}
			{#if $delayed}
				<span class="loading loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
