<script>
	import CourseCard from '$lib/components/ui/card/CourseCard.svelte';

	const { data } = $props();
</script>

<section class="mt-8 flex min-h-screen flex-col items-center max-md:mt-32">
	<h2 class="text-header1">Discover our learning courses</h2>

	<div class="mt-4 grid w-full grid-cols-4 items-stretch gap-4 py-2 max-md:grid-cols-2">
		{#await data.courses}
			{#each Array(16) as skeleton}
				<div class="h-64 w-full skeleton"></div>
			{/each}
		{:then courses}
			{#each courses as course (course.id)}
				<CourseCard {course} />
			{/each}
		{:catch err}
			<p class="text-error">Error loading courses</p>
		{/await}
	</div>
</section>
