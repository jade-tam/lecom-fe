<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import type { Enrollment } from '$lib/types/Enrollment';

	const { data } = $props();
	const enrollments: Enrollment[] = $derived(data.enrollments);

	function handleGoToCourse(slug: string) {
		goto(resolve(`/learning/course/${slug}`));
	}
</script>

<h1 class="my-2 text-center">Enrolled Courses</h1>
{#if enrollments.length}
	<div class="flex flex-col gap-2">
		{#each enrollments as enrollment (enrollment.id)}
			<div class="flex flex-row rounded-box border bg-base-100 p-4 shadow">
				<Image
					src={enrollment.courseThumbnail}
					alt={enrollment.courseTitle}
					class="mr-6 h-32 aspect-video"
				/>

				<div class="flex flex-1 flex-col">
					<h2 class="card-title">{enrollment.courseTitle}</h2>
					<p class="text-sm text-base-content/70">
						{enrollment.shopName} - {enrollment.categoryName}
					</p>
					<div class="mt-2 flex items-center gap-4">
						<!-- <div
							class="radial-progress text-primary"
							style="--value:{enrollment.progress};"
							aria-valuenow={enrollment.progress}
							role="progressbar"
						>
							{enrollment.progress}%
						</div> -->
						<span class="badge {enrollment.completedAt ? 'badge-success' : 'badge-warning'}">
							{enrollment.completedAt ? 'Completed' : 'In Progress'}
						</span>
						<progress
							class="progress w-56 grow {enrollment.completedAt
								? 'progress-success'
								: 'progress-warning'}"
							value="0"
							max="100"
						></progress>
						<span class="font-bold">{enrollment.progress}%</span>
					</div>
					<p class="mt-3 text-xs text-base-content/70 italic">
						Enrolled at {enrollment.enrolledAt.slice(0, 10)}
					</p>
					{#if enrollment.completedAt}
						<p class="mt-1 text-xs text-primary-content/70 italic">
							Completed at {enrollment.completedAt.slice(0, 10)}
						</p>
					{/if}
				</div>
				<div class="ml-6 flex items-center">
					<button class="btn btn-primary" onclick={() => handleGoToCourse(enrollment.courseSlug)}>
						Continue Learning
					</button>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<EmptyPlaceholder text="No enrolled courses yet" icon="icon-[fa7-solid--book-open]" />
{/if}
