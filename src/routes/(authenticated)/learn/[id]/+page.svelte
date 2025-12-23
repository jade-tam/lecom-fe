<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import { formatVideoDuration, formatVND, toRomanNumeral } from '$lib/utils/converters.js';
	import showToast from '$lib/utils/showToast';

	const { data, form } = $props();
	const courseLearning = $derived(data.courseLearning);

	// Use $state for reactive variables
	let selectedSectionIdx = $state(0);
	let selectedLessonIdx = $state(0);

	// Correct usage of $derived for selectedLesson
	const selectedLesson = $derived.by(() => {
		const section = courseLearning?.sections[selectedSectionIdx];
		return section?.lessons[selectedLessonIdx] ?? null;
	});

	function selectLesson(sectionIdx: number, lessonIdx: number) {
		selectedSectionIdx = sectionIdx;
		selectedLessonIdx = lessonIdx;
	}

	let videoElement: HTMLVideoElement | null = $state(null);
	let completeLessonForm: HTMLFormElement | null = $state(null);
	let wasPlaying = $state(false);
	let playedDuration = $state(0);

	function handleVideoEnded() {
		if (completeLessonForm) {
			completeLessonForm.requestSubmit();
		}
	}

	function handleSeeking() {
		if (videoElement) {
			wasPlaying = !videoElement.paused;

			// Prevent seeking ahead of what's been played
			if (videoElement.currentTime > videoElement.played.end(0)) {
				videoElement.currentTime = videoElement.played.end(0);
			}
		}
	}

	function handleSeeked() {
		if (videoElement && wasPlaying) {
			videoElement.play();
		}
	}

	function handleTimeUpdate() {
		if (videoElement) {
			playedDuration = videoElement.played.end(0);
		}
	}

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);

			console.log(form);

			if (form.toastData.type === 'success') {
				invalidateAll();
			}
		}
	});
</script>

<!-- Hidden form for completing lesson -->
<form
	action="?/completeLesson"
	method="POST"
	use:enhance
	style="display: none"
	bind:this={completeLessonForm}
>
	<input type="hidden" name="lessonId" value={selectedLesson?.id} />
</form>

{#if courseLearning}
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={() => history.back()}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button>
			<h1 class="text-header3 font-bold">Khóa học: {courseLearning.course.title}</h1>
		</div>
		<p class="line-clamp-1 text-base-content/60">
			{courseLearning.course.summary}
		</p>
	</AnimatedDiv>
	<div class="mt-2 grid grid-cols-12 gap-2 max-md:grid-cols-1">
		<!-- Left: Video & Info -->
		<div class="col-span-8 max-md:col-span-1">
			{#if selectedLesson}
				<div
					class="mb-2 flex aspect-video w-full items-center justify-center overflow-hidden rounded-box border bg-black"
				>
					{#if selectedLesson.type === 'Video'}
						<video
							bind:this={videoElement}
							src={selectedLesson.contentUrl}
							controls
							volume={0.3}
							class="h-full w-full"
							onended={handleVideoEnded}
							onseeking={handleSeeking}
							onplay={handleTimeUpdate}
							onpause={handleTimeUpdate}
						>
							<track kind="captions" src="" srclang="vi" label="Vietnamese captions" />
						</video>
					{:else}
						<Image
							src={courseLearning.course.thumbnail}
							alt={selectedLesson.title}
							class="h-full w-full object-cover"
						/>
					{/if}
				</div>
				<h2 class="mb-2 text-xl font-bold">
					Bài Học {selectedLessonIdx + 1} - {selectedLesson.title}
				</h2>
				<div class="mb-2 flex items-center gap-5 text-sm text-base-content/70">
					{#if selectedLesson.isCompleted}
						<span class="badge badge-success">Hoàn thành</span>
						<span class="text-success-content"
							>Đã nhận được <strong>{selectedLesson.xpReward} XP</strong></span
						>
					{:else}
						<span class="badge badge-warning">Đang học</span>
						<span
							>Hoàn thành bài học để nhận được <strong class="text-success-content"
								>{selectedLesson.xpReward} XP</strong
							></span
						>
					{/if}
					<span
						>Thời lượng bài học <strong
							>{formatVideoDuration(selectedLesson.durationSeconds)}</strong
						></span
					>
					{#if videoElement}
						<span class="text-info-content"
							>Đang học tới <strong>{formatVideoDuration(playedDuration)}</strong></span
						>
					{/if}
				</div>

				<!-- Related products -->
				{#if selectedLesson.linkedProducts?.length}
					<div class="mt-4">
						<p class="mb-2 flex items-center gap-2 font-serif font-bold">
							<span class="icon-[fa7-solid--box-open]"></span>Sản phẩm trong khoá học
						</p>
						<div class="flex gap-2">
							{#each selectedLesson.linkedProducts as product}
								<a href="/shopping/product/{product.slug}" class="group flex-1" target="_blank">
									<div
										class="flex gap-2 rounded-field border bg-base-100 p-2 duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
									>
										<Image
											src={product.thumbnailUrl}
											alt={product.name}
											class="h-16 w-16 shrink-0 rounded"
										/>
										<div class="w-full">
											<p class="flex items-start justify-between gap-4 font-bold">
												<span class=" line-clamp-2 text-xs">{product.name}</span>
												<span class="icon-[fa7-solid--external-link] text-sm text-secondary"></span>
											</p>
											<p class="text-xs text-base-content/70 italic">{product.categoryName}</p>
											<p class="font-serif font-bold text-primary-content">
												{formatVND(product.price)}
											</p>
										</div>
									</div>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			{:else}
				<EmptyPlaceholder
					text="Chưa có bài học được chọn"
					description="Vui lòng chọn một bài học để bắt đầu học"
				/>
			{/if}
		</div>

		<div class="col-span-4 flex flex-col gap-2 max-md:col-span-1">
			<!-- Course info -->
			<div class="flex flex-col gap-2 rounded-box border bg-base-100 p-4">
				<div class="flex items-center gap-4">
					<Image
						src={courseLearning.course.thumbnail}
						alt={courseLearning.course.title}
						class="aspect-video h-22 shrink-0 rounded-box object-cover"
					/>
					<div class="flex flex-col gap-2">
						<p class="line-clamp-1 font-serif font-bold">{courseLearning.course.title}</p>
						<div class="flex gap-2">
							<span class="badge badge-secondary">{courseLearning.course.categoryName}</span>
						</div>
						<p class="line-clamp-1 text-sm text-base-content/70">{courseLearning.course.summary}</p>
					</div>
				</div>
			</div>

			<!-- Tiến độ hoàn thành section (already present) -->
			<div class="rounded-box border bg-base-100 p-4">
				<h3 class="mb-2 font-bold">Tiến độ hoàn thành</h3>
				<p class="text-xs text-base-content/70">
					Đã hoàn thành <strong>{courseLearning.progress.completedLessons}</strong> trên tổng số
					<strong>{courseLearning.progress.totalLessons}</strong> bài học
				</p>
				<div class="flex items-center gap-4">
					<progress
						class="progress w-full {courseLearning.progress.percent === 100
							? ' progress-success'
							: ' progress-warning'}"
						value={courseLearning.progress.percent}
						max="100"
					></progress>
					<span class="font-bold">{courseLearning.progress.percent}%</span>
				</div>
			</div>

			<!-- Right: Sections & Lessons -->
			<div class="rounded-box border bg-base-100 p-4">
				<h3 class="mb-2">Nội dung khóa học</h3>
				<p class="mb-2 text-xs text-base-content/70">
					Lựa chọn một bài học phía dưới để bắt đầu học
				</p>
				{#if courseLearning.sections.length}
					{#each courseLearning.sections as section, sectionIdx (section.id)}
						<div class="mb-4">
							<p class="mb-2 font-bold">{toRomanNumeral(sectionIdx + 1)}. {section.title}</p>
							<div class="flex flex-col gap-1">
								{#each section.lessons as lesson, lessonIdx (lesson.id)}
									<button
										class="btn flex w-full items-center gap-2 px-3 {lesson.isCompleted
											? 'btn-success'
											: 'btn-secondary'} {selectedSectionIdx === sectionIdx &&
										selectedLessonIdx === lessonIdx
											? ''
											: 'btn-outline'}"
										onclick={() => selectLesson(sectionIdx, lessonIdx)}
									>
										<span
											class="{lesson.type === 'Video'
												? 'icon-[mingcute--video-fill] text-primary-content'
												: 'icon-[mingcute--inventory-fill] text-secondary-content'} text-xl"
										></span>

										<!-- TEXT BLOCK -->
										<span class="flex grow flex-col">
											<span class="line-clamp-1 text-left">
												{lessonIdx + 1}. {lesson.title}
											</span>
										</span>

										<span class="mr-1 text-sm font-light"
											>{formatVideoDuration(lesson.durationSeconds)}</span
										>

										<span class="shrink-0 text-xs font-black text-success-content"
											>{lesson.xpReward} XP</span
										>

										{#if lesson.isCompleted}
											<span class="icon-[fa7-solid--check-circle] text-success-content"></span>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				{:else}
					<EmptyPlaceholder
						text="Khoá học này chưa có bài học nào"
						description="Nội dung khóa học sẽ được cập nhật trong thời gian sớm nhất"
					/>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<EmptyPlaceholder
		text="Khóa học không tồn tại hoặc bạn chưa đăng ký khóa học này"
		description="Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ"
	/>
{/if}
