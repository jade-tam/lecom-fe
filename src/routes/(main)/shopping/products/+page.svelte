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
	import NumberFlow from '@number-flow/svelte';

	const { data } = $props();

	const MAX_PRICE = 5000000;

	const sortByOptions: RadioInputOption[] = [
		{
			label: 'Giá tăng dần',
			value: 'price_asc'
		},
		{
			label: 'Giá giảm dần',
			value: 'price_desc'
		},
		{
			label: 'Tên A-Z',
			value: 'name_asc'
		},
		{
			label: 'Tên Z-A',
			value: 'name_desc'
		},
		{
			label: 'Cũ nhất',
			value: 'oldest'
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
		if (pageNumber) searchParams.set('page', String(pageNumber));

		goto(`./products?${searchParams.toString()}`, {
			replaceState: true
		});
	}
</script>

<section class="flex min-h-screen flex-col items-center">
	<div class="my-4 flex items-center justify-between self-start">
		{#await data.queryResult}
			<div class="loading loading-infinity"></div>
		{:then queryResult}
			<p class="text-sm font-light text-base-content/70">
				Đang hiển thị <strong class="font-bold">{queryResult.items.length} kết quả</strong>
				{#if search}
					cho từ khoá tìm kiếm <span class="font-bold">
						'{search}'
					</span>
				{/if}
			</p>
		{:catch err}
			<p class="text-error">Có lỗi xảy ra khi tải sản phẩm</p>
		{/await}
	</div>

	<div class="grid w-full grid-cols-12 gap-2 max-md:grid-cols-1">
		<div class="col-span-3 h-fit rounded-box border bg-base-100 p-4 text-secondary-content">
			<p class="font-serif text-lg font-bold text-base-content">Lọc theo danh mục</p>
			<div class="mt-2 flex flex-col gap-2">
				{#await data.categories}
					<div class="loading loading-infinity"></div>
				{:then categories}
					{#if categories.length}
						<RadioInput
							bind:value={category}
							options={categories.map((cat) => ({
								label: cat.name,
								value: cat.slug
							}))}
						/>
					{:else}
						<p class="text-xs text-base-content/60 italic">Không tìm thấy danh mục</p>
					{/if}
				{:catch err}
					<p class="text-error">Có lỗi xảy ra khi tải danh mục</p>
				{/await}

				<!-- =================================== -->
				<div class="divider my-0"></div>
				<p class="font-serif text-lg font-bold text-base-content">Khoảng giá</p>
				<p class="font-serif text-lg font-bold text-primary-content">
					0 - <NumberFlow value={maxPrice} format={formatVND} />
				</p>
				<div class="w-full max-w-xs">
					<input
						type="range"
						bind:value={maxPrice}
						min="0"
						max={MAX_PRICE}
						class="range range-primary"
						step="100000"
					/>
					<div class="mt-2 flex justify-between text-xs">
						<span>0</span>
						<span>5,000,000</span>
					</div>
				</div>

				<!-- =================================== -->
				<div class="divider my-0"></div>
				<p class="font-serif text-lg font-bold text-base-content">Sắp xếp theo</p>
				<div class="mt-1 flex flex-col gap-2">
					<RadioInput bind:value={sort} options={sortByOptions} />
				</div>

				<!-- =================================== -->
				<div class="divider mb-1"></div>
				<button class="btn btn-primary" onclick={handleApplyFilter}>Áp dụng</button>
				<button class="btn" onclick={handleClearAllFilter}>Xóa tất cả</button>
			</div>
		</div>
		<div
			class="col-span-9 grid h-fit w-full grid-cols-4 gap-2 max-lg:grid-cols-3 max-md:grid-cols-2"
		>
			{#await data.queryResult}
				{#each Array(4) as skeleton}
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
					<EmptyPlaceholder text="Không tìm thấy sản phẩm" />
				{/if}
			{:catch err}
				<p class="text-error">Lỗi tải sản phẩm</p>
			{/await}
		</div>
	</div>
</section>
