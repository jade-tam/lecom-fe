<script lang="ts">
	import { addCourseLessonSchema, type AddCourseLessonSchema } from '$lib/schemas/courseSchema';
	import { courseTypeOptions } from '$lib/types/Course';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import FormInput from '../ui/FormInput.svelte';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import FormMediaInput from '../ui/FormMediaInput.svelte';
	import { invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const {
		dataForm,
		onFormActionSuccess,
		courseSectionId,
		orderIndex
	}: {
		dataForm: AddCourseLessonSchema;
		onFormActionSuccess?: () => void;
		courseSectionId: string;
		orderIndex: number;
	} = $props();

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, reset, submit } =
		superForm<AddCourseLessonSchema, { toastData?: ToastData }>(dataForm, {
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
<SuperDebug data={errors} />

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
						onchange={(e: Event) => {
							const input = e.target as HTMLInputElement;
							$form.type = input.value as 'Video' | 'Quiz';
							if (input.value === 'Video') {
								$form.quiz = null;
							} else if (input.value === 'Quiz') {
								$form.contentUrl = null;
								$form.durationSeconds = 0;
							}
						}}
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
			{#if $errors.quiz?.questions?._errors}
				{#each $errors.quiz.questions._errors as error}
					<p class="ml-2 text-error">{error}</p>
				{/each}
			{/if}

			{#each $form.quiz?.questions ?? [] as question, qIdx (qIdx)}
				<div
					class="relative mb-4 rounded border bg-base-200 p-2"
					transition:slide={{ duration: 200, axis: 'y' }}
					animate:flip
				>
					<div class="flex items-center gap-2">
						<p class="mb-1 block shrink-0 text-xs font-bold">Câu hỏi {qIdx + 1}</p>
						<input
							type="text"
							class="input input-sm mb-1 w-full"
							value={question.content}
							onchange={(e) => {
								const input = e.target as HTMLInputElement;
								$form.quiz!.questions[qIdx].content = input.value;
							}}
						/>
						<button
							type="button"
							class="btn ml-2 btn-xs btn-error"
							onclick={() => {
								$form.quiz!.questions = $form.quiz!.questions.filter((_, i) => i !== qIdx);
							}}>Xóa câu hỏi</button
						>
					</div>
					{#if $errors.quiz?.questions?.[qIdx]?.content}
						{#each $errors.quiz.questions[qIdx].content as error}
							<p class="ml-2 text-error">{error}</p>
						{/each}
					{/if}
					<div class="mt-2 ml-4">
						{#if $errors.quiz?.questions?.[qIdx]?.answers?._errors}
							{#each $errors.quiz.questions[qIdx].answers._errors as error}
								<p class="mb-2 ml-4 text-error">{error}</p>
							{/each}
						{/if}
						<button
							type="button"
							class="btn mb-2 btn-xs btn-secondary"
							onclick={() => {
								$form.quiz!.questions[qIdx].answers = [
									...($form.quiz!.questions[qIdx].answers ?? []),
									{ content: '', isCorrect: false }
								];
							}}>+ Thêm đáp án</button
						>
						{#each question.answers as answer, aIdx (aIdx)}
							<div class="mb-1 flex items-center gap-2">
								<p class="block shrink-0 text-xs">Đáp án {aIdx + 1}</p>
								<input
									type="text"
									class="input input-xs w-48"
									name={`quiz.questions.${qIdx}.answers.${aIdx}.content`}
									value={answer.content}
									onchange={(e) => {
										const input = e.target as HTMLInputElement;
										$form.quiz!.questions[qIdx].answers[aIdx].content = input.value;
										console.log(input.value);
									}}
								/>

								<label class="flex shrink-0 items-center gap-1">
									<input
										type="checkbox"
										class="checkbox"
										checked={answer.isCorrect}
										onchange={() => {
											$form.quiz!.questions[qIdx].answers[aIdx].isCorrect =
												!$form.quiz!.questions[qIdx].answers[aIdx].isCorrect;
										}}
									/>
									Đáp án đúng
								</label>
								<button
									type="button"
									class="btn btn-xs btn-error"
									onclick={() => {
										$form.quiz!.questions[qIdx].answers = $form.quiz!.questions[
											qIdx
										].answers.filter((_, j) => j !== aIdx);
									}}>Xóa đáp án</button
								>
							</div>
							{#if $errors.quiz?.questions?.[qIdx]?.answers?.[aIdx]?.content}
								{#each $errors.quiz.questions[qIdx].answers[aIdx].content as error}
									<p class="ml-6 text-error">{error}</p>
								{/each}
							{/if}
						{/each}
					</div>
				</div>
			{/each}

			<button
				type="button"
				class="btn mb-2 btn-sm btn-secondary"
				onclick={() => {
					if (!$form.quiz) $form.quiz = { questions: [] };
					$form.quiz.questions = [
						...($form.quiz.questions ?? []),
						{ content: '', answers: [{ content: '', isCorrect: false }] }
					];
				}}>+ Thêm câu hỏi</button
			>

			{#if $errors.quiz?._errors}
				{#each $errors.quiz._errors as error}
					<p class="text-error">{error}</p>
				{/each}
			{/if}
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
