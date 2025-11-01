<script lang="ts">
	import type { Course } from '$lib/types/Course';
	import Image from '../Image.svelte';

	const { course }: { course: Course } = $props();
</script>

<a href="/learning/course/{course.slug}" class="group">
	<div
		class="flex h-full flex-col gap-3 rounded-box border bg-base-100 p-3 shadow duration-200 group-hover:-translate-y-2 group-hover:shadow-lg"
	>
		<Image src={course.courseThumbnail} class="h-38 w-full" border="" alt={course.title} />
		<p class="font-medium">{course.title}</p>
		<div class="badge badge-sm badge-secondary">{course.categoryName}</div>
		<div class="flex items-center gap-2">
			<Image class="h-8 w-8 rounded-full" src={course.shopAvatar} alt={course.shopName} />
			<p class="text-sm">{course.shopName}</p>
		</div>
	</div>
</a>
