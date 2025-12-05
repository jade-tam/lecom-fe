<script lang="ts">
	import type { Course } from '$lib/types/Course';
	import { fly } from 'svelte/transition';
	import Image from '../Image.svelte';
	import { expoInOut } from 'svelte/easing';

	const { course, index }: { course: Course; index?: number } = $props();
</script>

<a href="/learning/course/{course.slug}" class="group">
	<div
		in:fly|global={{ y: 20, duration: 800, delay: 0 + (index ?? 0) * 50, easing: expoInOut }}
		class="flex h-full flex-col gap-2 rounded-field border bg-base-100 p-3 shadow duration-200 group-hover:-translate-y-2 group-hover:shadow-lg"
	>
		<Image
			src={course.courseThumbnail}
			class="aspect-video h-38 -translate-y-6 group-hover:-translate-y-0 duration-200"
			alt={course.title}
		/>
		<p class="font-semibold text-sm flex items-start gap-2 line-clamp-2"><span class="icon-[mingcute--book-2-fill] text-success-content text-xl shrink-0"></span>{course.title}</p>
		<p class="text-xs font-light line-clamp-2">{course.summary}</p>
		<div class="badge badge-sm badge-success">{course.categoryName}</div>
		<div class="flex items-center gap-2">
			<Image class="h-8 w-8 rounded-full" src={course.shopAvatar} alt={course.shopName} />
			<p class="text-sm">{course.shopName}</p>
		</div>
	</div>
</a>
