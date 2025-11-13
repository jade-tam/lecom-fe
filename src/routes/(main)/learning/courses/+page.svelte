<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CourseCard from '$lib/components/ui/card/CourseCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import RadioInput from '$lib/components/ui/RadioInput.svelte';
	import CourseCardSkeleton from '$lib/components/ui/skeleton/CourseCardSkeleton.svelte';

	const { data } = $props();

	let search: string | null = $state(null);
	let category: string | null = $state(null);
	// let sort: string | null = $state(null);
	let pageNumber: number | null = $state(null);

	$effect(() => {
		search = page.url.searchParams.get('search') ?? null;
		category = page.url.searchParams.get('category') ?? null;
		// sort = page.url.searchParams.get('sort') ?? null;
		pageNumber = Number(page.url.searchParams.get('page')) ?? null;
	});

	function handleApplyFilter() {
		const searchParams = new URLSearchParams();
		if (search) searchParams.set('search', search);
		if (category) searchParams.set('category', category);
		// if (sort) searchParams.set('sort', sort);
		if (pageNumber) searchParams.set('page', String(pageNumber));

		goto(`./courses?${searchParams.toString()}`, {
			replaceState: true
		});
	}

	function handleClearAllFilter() {
		category = null;
		// sort = null;

		const searchParams = new URLSearchParams();
		if (pageNumber) searchParams.set('page', String(pageNumber));

		goto(`./courses?${searchParams.toString()}`, {
			replaceState: true
		});
	}
</script>

<section class="flex min-h-screen flex-col items-center">
	<div class="my-4 flex items-center justify-between self-start">
		{#await data.queryResult}
			<div class="loading loading-infinity"></div>
		{:then queryResult}
			<p>
				Showing <strong>{queryResult.items.length} results</strong>
				{#if search}
					for <span class="font-bold">
						'{search}'
					</span>
				{/if}
			</p>
		{:catch err}
			<p class="text-error">Error loading courses</p>
		{/await}
	</div>

	<div class="grid w-full grid-cols-12 gap-6 max-md:grid-cols-1">
		<div class="col-span-3 h-fit rounded-box border bg-base-100 p-4">
			<p class="font-serif text-lg font-bold">Filter by category</p>
			<div class="mt-2 flex flex-col gap-2">
				{#await data.categories}
					<div class="loading loading-infinity"></div>
				{:then categories}
					{#if categories.length}
						<RadioInput
							bind:value={category}
							options={categories.map((cat) => ({
								label: cat.name,
								value: cat.id
							}))}
						/>
					{:else}
						<p class="text-xs text-base-content/60 italic">No category found</p>
					{/if}
				{:catch err}
					<p class="text-error">Error loading courses</p>
				{/await}

				<!-- =================================== -->
				<div class="divider mb-1"></div>
				<button class="btn btn-primary" onclick={handleApplyFilter}>Apply</button>
				<button class="btn" onclick={handleClearAllFilter}>Clear All</button>
			</div>
		</div>
		<div
			class="col-span-9 grid h-fit w-full grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2"
		>
			{#await data.queryResult}
				{#each Array(4) as skeleton}
					<CourseCardSkeleton />
				{/each}
			{:then result}
				{#if result.items.length}
					{#each result.items as course (course.id)}
						<CourseCard {course} />
					{/each}

					<div class="col-span-full">
						<Pagination
							page={result.page}
							pageSize={result.pageSize}
							totalItems={result.totalItems}
							totalPages={result.totalPages}
						/>
					</div>
				{:else}
					<EmptyPlaceholder text="No course found" />
				{/if}
			{:catch err}
				<p class="text-error">Error loading courses</p>
			{/await}
		</div>
	</div>
</section>
