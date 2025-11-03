<script>
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import ProductCardSkeleton from '$lib/components/ui/skeleton/ProductCardSkeleton.svelte';

	const { data } = $props();
</script>

<section class="mt-8 flex min-h-screen flex-col items-center max-md:mt-32">
	<h2 class="text-header1">Discover our shopping products</h2>

	<div
		class="grid w-full grid-cols-4 items-stretch gap-4 max-lg:grid-cols-3 max-md:grid-cols-2"
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
