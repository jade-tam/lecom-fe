<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import type { RadioInputOption } from '$lib/components/ui/RadioInput.svelte';
	import RadioInput from '$lib/components/ui/RadioInput.svelte';
	import ProductCardSkeleton from '$lib/components/ui/skeleton/ProductCardSkeleton.svelte';
	import { formatVND } from '$lib/utils/converters.js';

	const { data } = $props();

	const MAX_PRICE = 50000000;

	const sortByOptions: RadioInputOption[] = [
		{
			label: 'Lowest Price',
			value: 'price'
		},
		{
			label: 'Highest Price',
			value: '-price'
		}
	];

	let search: string | null = $state(null);
	let category: string | null = $state(null);
	let sort: string | null = $state(null);
	let pageNumber: number | null = $state(null);
	let minPrice: number = $state(0);
	let maxPrice: number = $state(0);

	$effect(() => {
		search = page.url.searchParams.get('search') ?? null;
		category = page.url.searchParams.get('category') ?? null;
		sort = page.url.searchParams.get('sort') ?? null;
		pageNumber = Number(page.url.searchParams.get('page')) ?? null;
		minPrice = Number(page.url.searchParams.get('minPrice') ?? 0);
		maxPrice = Number(page.url.searchParams.get('maxPrice') ?? MAX_PRICE);
	});

	function handleApplyFilter() {
		const searchParams = new URLSearchParams();
		if (search) searchParams.set('search', search);
		if (category) searchParams.set('category', category);
		if (sort) searchParams.set('sort', sort);
		if (pageNumber) searchParams.set('page', String(pageNumber));
		if (minPrice > 0) searchParams.set('minPrice', String(minPrice));
		if (maxPrice < MAX_PRICE) searchParams.set('maxPrice', String(maxPrice));

		goto(`./products?${searchParams.toString()}`, {
			replaceState: true
		});
	}

	function handleClearAllFilter() {
		category = null;
		sort = null;
		minPrice = 0;
		maxPrice = MAX_PRICE;

		const searchParams = new URLSearchParams();
		if (search) searchParams.set('search', search);
		if (pageNumber) searchParams.set('page', String(pageNumber));

		goto(`./products?${searchParams.toString()}`, {
			replaceState: true
		});
	}
</script>

<section class="flex min-h-screen flex-col items-center max-md:mt-32">
	<div class="my-4 flex items-center justify-between self-start">
		<p>Showing xxx results for <span class="font-bold">'{search}'</span></p>
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
					<p class="text-error">Error loading products</p>
				{/await}

				<!-- =================================== -->
				<div class="divider mb-1"></div>
				<p class="font-serif text-lg font-bold">Price range</p>
				<p class="font-bold text-primary-content">0 - {formatVND(maxPrice)}</p>
				<div class="w-full max-w-xs">
					<input
						type="range"
						bind:value={maxPrice}
						min="0"
						max="50000000"
						class="range range-primary"
						step="500000"
					/>
					<div class="mt-2 flex justify-between text-xs">
						<span>0</span>
						<span>50,000,000</span>
					</div>
				</div>

				<!-- =================================== -->
				<div class="divider mb-1"></div>
				<p class="font-serif text-lg font-bold">Sort by</p>
				<div class="mt-1 flex flex-col gap-2">
					<RadioInput bind:value={sort} options={sortByOptions} />
				</div>

				<!-- =================================== -->
				<div class="divider mb-1"></div>
				<button class="btn btn-primary" onclick={handleApplyFilter}>Apply</button>
				<button class="btn" onclick={handleClearAllFilter}>Clear All</button>
			</div>
		</div>
		<div
			class="col-span-9 grid w-full grid-cols-4 items-stretch gap-4 max-lg:grid-cols-3 max-md:grid-cols-2"
		>
			{#await data.queryResult}
				{#each Array(12) as skeleton}
					<ProductCardSkeleton />
				{/each}
			{:then result}
				{#if result.items.length}
					{#each result.items as product (product.id)}
						<ProductCard {product} />
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
					<EmptyPlaceholder text="No product found" />
				{/if}
			{:catch err}
				<p class="text-error">Error loading products</p>
			{/await}
		</div>
	</div>
</section>
