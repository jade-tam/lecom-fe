<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import type { Enrollment } from '$lib/types/Enrollment';
	import { formatDateTime } from '$lib/utils/converters.js';

	const { data } = $props();
	const enrollments: Enrollment[] = $derived(data.enrollments);

	function handleGoToCourse(id: string) {
		goto(resolve(`/learn/${id}`));
	}
</script>

<div class="min-h-screen">
	<div class="my-2 flex items-end justify-between">
		<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<button class="btn btn-sm" aria-label="Quay lại" onclick={() => history.back()}>
					<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
				</button>
				<h1 class="text-header3 font-bold">Khóa học của tôi</h1>
			</div>
			<p class="text-base-content/60">
				Xem các khóa học đã đăng ký và theo dõi tiến độ học tập của bạn
			</p>
		</AnimatedDiv>
		<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-1">
			<div class="rounded-box border bg-base-100/30 p-2 px-3">
				<p class="text-xs text-base-content/70">Tổng số khóa học</p>
				<p class="font-serif text-xl font-bold">{enrollments.length}</p>
			</div>
			<div class="rounded-box border bg-warning/30 p-2 px-3">
				<p class="text-xs text-warning-content/70">Đang học</p>
				<p class="font-serif text-xl font-bold text-warning-content">
					{enrollments.filter((e) => !e.completedAt).length}
				</p>
			</div>
			<div class="rounded-box border bg-success/30 p-2 px-3">
				<p class="text-xs text-success-content/70">Đã hoàn thành</p>
				<p class="font-serif text-xl font-bold text-success-content">
					{enrollments.filter((e) => e.completedAt).length}
				</p>
			</div>
		</AnimatedDiv>
	</div>

	<!-- Content Section -->
	<div>
		{#if enrollments.length}
			<div class="space-y-2">
				{#each enrollments as enrollment (enrollment.id)}
					<div
						class="group rounded-box border border-base-200 bg-base-100 p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
					>
						<div class="flex flex-col gap-6 max-lg:grid-cols-1 lg:flex-row lg:items-start">
							<!-- Course Thumbnail -->
							<div class="flex-shrink-0">
								<Image
									src={enrollment.courseThumbnail}
									alt={enrollment.courseTitle}
									class="aspect-video h-40 w-60 rounded-field"
								/>
							</div>

							<!-- Course Details -->
							<div class="flex-1">
								<!-- Title and Info -->
								<div class="mb-4">
									<h2 class="text-header3 font-bold text-base-content">{enrollment.courseTitle}</h2>
									<p class="mt-1 text-sm text-base-content/60">
										<span class="font-semibold text-secondary-content/70"
											>{enrollment.shopName}</span
										>
										<span class="mx-2 text-base-content/40">•</span>
										<span class="text-success-content/70">{enrollment.categoryName}</span>
									</p>
								</div>

								<!-- Progress Section -->
								<div class="space-y-3">
									<!-- Status Badge -->
									<div class="flex items-center gap-3">
										<span
											class="badge {enrollment.completedAt
												? 'badge-success'
												: 'badge-warning'} gap-1"
										>
											<span
												class="icon-[{enrollment.completedAt
													? 'mingcute--check-fill'
													: 'mingcute--time-line'}]"
											></span>
											{enrollment.completedAt ? 'Hoàn thành' : 'Đang học'}
										</span>
										<span class="text-sm font-semibold">{enrollment.progress}%</span>
									</div>

									<!-- Progress Bar -->
									<progress
										class="progress h-2 w-full {enrollment.completedAt
											? 'progress-success'
											: 'progress-warning'}"
										value={enrollment.progress}
										max="100"
									></progress>

									<!-- Enrollment Dates -->
									<div class="text-xs text-base-content/60">
										<p class="flex items-center gap-1">
											<span class="icon-[mingcute--calendar-line]"></span>
											Đã đăng ký học từ {formatDateTime(enrollment.enrolledAt)}
										</p>
										{#if enrollment.completedAt}
											<p class="mt-1 flex items-center gap-1 text-success-content">
												<span class="icon-[mingcute--check-circle-fill]"></span>
												Hoàn thành lúc {formatDateTime(enrollment.completedAt)}
											</p>
										{/if}
									</div>
								</div>
							</div>

							<!-- Action Button -->
							<div class="flex-shrink-0 self-center lg:self-start">
								<button
									class="btn gap-2 whitespace-nowrap btn-lg btn-primary"
									onclick={() => handleGoToCourse(enrollment.courseId)}
								>
									<span class="icon-[mingcute--play-fill]"></span>
									Tiếp tục học
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyPlaceholder text="Bạn chưa đăng ký khóa học nào" icon="icon-[fa7-solid--book-open]" />
		{/if}
	</div>
</div>
