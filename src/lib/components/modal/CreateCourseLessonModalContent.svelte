<script lang="ts">
	import { addCourseLessonSchema } from '$lib/schemas/courseSchema';
	import { courseTypeOptions } from '$lib/types/Course';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormInput from '../ui/FormInput.svelte';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import FormMediaInput from '../ui/FormMediaInput.svelte';
	import { invalidateAll } from '$app/navigation';

	const { dataForm, onFormActionSuccess, courseSectionId, orderIndex } = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset, submit } =
		superForm(dataForm, {
			dataType: 'json',
			id: 'createCourseLessonForm',
			validators: zod4Client(addCourseLessonSchema),
			invalidateAll: false
		});

	function handleSubmit() {
		submit();
	}

	$effect(() => {
		$form['courseSectionId'] = courseSectionId;
		$form['orderIndex'] = orderIndex;
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

<SuperDebug data={form} />

<form action="?/createCourseLesson" method="POST" use:enhance>
	<h3 class="mb-2 font-bold">Thêm bài học mới</h3>
	<div class="mb-4">
		<label class="mb-1 block text-xs font-semibold" for="type">Loại bài học</label>
		<div class="mt-2 flex items-center gap-6">
			{#each courseTypeOptions as opt, idx}
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="type"
						value={opt.value}
						bind:group={$form.type}
						checked={$form.type === opt.value}
						class={idx === 0 ? 'radio radio-primary' : 'radio radio-secondary'}
					/>
					<span
						class="text-xl {opt.value === 'Video'
							? 'icon-[mingcute--video-fill]'
							: 'icon-[mingcute--inventory-fill]'}"
					></span>
					<span>{opt.title}</span>
				</label>
			{/each}
		</div>

		{#if $errors['type']}
			{#each $errors['type'] as string[] as error}
				<p class="text-error">{error}</p>
			{/each}
		{/if}
	</div>

	<FormInput
		name="title"
		label="Tiêu đề bài học"
		placeholder="Nhập tiêu đề bài học..."
		superForm={form}
		{errors}
	/>

	{#if $form.type === 'Video'}
		<FormMediaInput
			name="contentUrl"
			label="Video bài học"
			help="Video dung lượng lớn có thể mất thời gian để tải lên. Vui lòng kiên nhẫn chờ đợi."
			mediaType="Video"
			aspectRatio="16:9"
			superForm={form}
			{errors}
			onUploadSuccess={({ url, duration }) => {
				console.log('✅ Upload done:', url, duration);
				if (duration) $form.durationSeconds = duration;
			}}
		/>

		<FormInput hidden name="durationSeconds" label="Thời lượng (giây)" superForm={form} {errors} />
	{/if}

	{#if $form.type === 'Quiz'}
		<fieldset class="mt-4 fieldset">
			<legend class="fieldset-legend">Quiz</legend>
			<!-- Quiz builder UI: You can expand this as needed -->
			{#each $form.quiz?.questions ?? [] as question, qIdx}
				<div class="mb-2">
					<FormInput
						label={`Câu hỏi ${qIdx + 1}`}
						name={`quiz.questions[${qIdx}].content`}
						superForm={form}
						{errors}
						required
					/>
					{#each question.answers as answer, aIdx}
						<FormInput
							label={`Đáp án ${aIdx + 1}`}
							name={`quiz.questions[${qIdx}].answers[${aIdx}].content`}
							superForm={form}
							{errors}
							required
						/>
						<label class="flex items-center gap-2">
							<input
								type="checkbox"
								name={`quiz.questions[${qIdx}].answers[${aIdx}].isCorrect`}
								bind:group={answer.isCorrect}
							/>
							Đáp án đúng
						</label>
					{/each}
				</div>
			{/each}
			<!-- Add/remove question/answer buttons can be implemented here -->
		</fieldset>
	{/if}

	<FormInput hidden name="orderIndex" label="Thứ tự" superForm={form} {errors} />

	<FormInput hidden name="courseSectionId" label="ID chương" superForm={form} {errors} />

	<div class="modal-action">
		<button type="button" onclick={handleSubmit} class="btn btn-primary" disabled={$submitting}
			>Thêm bài học
			{#if $delayed}
				<span class="loading loading-md loading-infinity"></span>
			{/if}
		</button>
	</div>
</form>
