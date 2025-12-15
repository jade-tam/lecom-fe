<script>
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import { getUserProfile } from '$lib/context/appContext.js';
	import { slide } from 'svelte/transition';

	const { data } = $props();

	const userProfile = getUserProfile();
</script>

{#if userProfile}
	<section class="mt-8 flex flex-col">
		<h2 class="text-header3">Đề xuất dành cho bạn</h2>

		<div class="mt-2 grid w-full grid-cols-5 items-stretch gap-2 max-md:grid-cols-2">
			{#await data.productBrowseDataPromise}
				<LoadingPlaceholder text="Đang tải danh sách sản phẩm" />
			{:then browseData}
				{#if browseData?.recommendedProducts.length}
					{#each browseData.recommendedProducts.slice(0, 10) as product, index (product.id)}
						<ProductCard {product} {index} />
					{/each}
				{:else}
					<EmptyPlaceholder text="Không có sản phẩm nào được đề xuất" />
				{/if}
			{:catch err}
				<p class="text-error">Có lỗi xảy ra trong khi đang tải sản phẩm đề xuất</p>
			{/await}
		</div>
	</section>

	{#await data.productBrowseDataPromise}
		<LoadingPlaceholder text="Đang tải danh sách sản phẩm" />
	{:then browseData}
		{#if browseData?.recommendedCategories.length}
			{#each browseData.recommendedCategories as category (category.id)}
				<section class="mt-8 flex flex-col">
					<div class="flex items-center gap-4">
						<h2 class="text-header3">{category.name}</h2>
						<a href="/shopping/products?category={category.slug}" class="btn btn-xs btn-primary"
							>Xem tất cả <span class="icon-[mingcute--arrow-right-fill]"></span></a
						>
					</div>

					<div class="mt-2 grid w-full grid-cols-4 items-stretch gap-2 max-md:grid-cols-2">
						{#if category.products.length}
							{#each category.products.slice(0, 4) as product, index (product.id)}
								<ProductCard {product} {index} />
							{/each}
						{:else}
							<EmptyPlaceholder text="Không có sản phẩm nào được đề xuất" />
						{/if}
					</div>
				</section>
			{/each}
		{:else}
			<EmptyPlaceholder text="Không có danh mục nào được đề xuất" />
		{/if}
	{:catch err}
		<p class="text-error">Có lỗi xảy ra trong khi đang tải danh mục đề xuất</p>
	{/await}

	<section class="mt-8 flex flex-col">
		<h2 class="text-header3">Sản phẩm đang trending</h2>

		<div class="mt-2 grid w-full grid-cols-5 items-stretch gap-2 max-md:grid-cols-2">
			{#await data.productBrowseDataPromise}
				<LoadingPlaceholder text="Đang tải danh sách sản phẩm" />
			{:then browseData}
				{#if browseData?.trendingProducts.length}
					{#each browseData.trendingProducts.slice(0, 10) as product, index (product.id)}
						<ProductCard {product} {index} />
					{/each}
				{:else}
					<EmptyPlaceholder text="Không có sản phẩm nào" />
				{/if}
			{:catch err}
				<p class="text-error">Có lỗi xảy ra trong khi đang tải sản phẩm</p>
			{/await}
		</div>
	</section>

	<section class="mt-8 flex flex-col">
		<h2 class="text-header3">Các sản phẩm bán chạy nhất</h2>

		<div class="mt-2 grid w-full grid-cols-5 items-stretch gap-2 max-md:grid-cols-2">
			{#await data.productBrowseDataPromise}
				<LoadingPlaceholder text="Đang tải danh sách sản phẩm" />
			{:then browseData}
				{#if browseData?.bestSellerProducts.length}
					{#each browseData.bestSellerProducts.slice(0, 10) as product, index (product.id)}
						<ProductCard {product} {index} />
					{/each}
				{:else}
					<EmptyPlaceholder text="Không có sản phẩm nào" />
				{/if}
			{:catch err}
				<p class="text-error">Có lỗi xảy ra trong khi đang tải sản phẩm</p>
			{/await}
		</div>
	</section>

	<section class="mt-8 flex flex-col">
		<h2 class="text-header3">Các sản phẩm mới nhất</h2>

		<div class="mt-2 grid w-full grid-cols-5 items-stretch gap-2 max-md:grid-cols-2">
			{#await data.productBrowseDataPromise}
				<LoadingPlaceholder text="Đang tải danh sách sản phẩm" />
			{:then browseData}
				{#if browseData?.newArrivalProducts.length}
					{#each browseData.newArrivalProducts.slice(0, 10) as product, index (product.id)}
						<ProductCard {product} {index} />
					{/each}
				{:else}
					<EmptyPlaceholder text="Không có sản phẩm nào" />
				{/if}
			{:catch err}
				<p class="text-error">Có lỗi xảy ra trong khi đang tải sản phẩm</p>
			{/await}
		</div>
	</section>
{/if}

<section class="mt-8 flex flex-col">
	<h2 class="text-header3">Khám phá các sản phẩm mua sắm</h2>

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
		class="mt-4 grid w-full grid-cols-4 items-stretch gap-2 max-lg:grid-cols-3 max-md:grid-cols-2"
	>
		{#await data.queryResult}
			<LoadingPlaceholder text="Đang tải danh sách sản phẩm" />
		{:then result}
			{#if result.items.length}
				{#each result.items as product, index (product.id)}
					<ProductCard {product} {index} />
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
				<EmptyPlaceholder text="Không có sản phẩm nào" />
			{/if}
		{:catch err}
			<p class="text-error">Có lỗi xảy ra trong khi đang tải sản phẩm</p>
		{/await}
	</div>
</section>
