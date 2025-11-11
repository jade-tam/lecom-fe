<script>
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import ProductCardSkeleton from '$lib/components/ui/skeleton/ProductCardSkeleton.svelte';

	const { data } = $props();
</script>

<section class="mt-8 flex min-h-screen flex-col items-center">
	<h2 class="text-header1">Discover our shopping products</h2>

	<div class="mt-2 flex gap-2 self-start">
		{#await data.categories}
			<div class="btn w-32 skeleton rounded-field btn-sm"></div>
			<div class="btn w-24 skeleton rounded-field btn-sm"></div>
			<div class="btn w-28 skeleton rounded-field btn-sm"></div>
		{:then categories}
			{#each categories as cat (cat.id)}
				<a class="btn btn-sm btn-secondary" href="/shopping/products?category={cat.id}">
					{cat.name}
				</a>
			{/each}
		{/await}
	</div>

	<div
		class="mt-4 grid w-full grid-cols-4 items-stretch gap-4 max-lg:grid-cols-3 max-md:grid-cols-2"
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
</section>
