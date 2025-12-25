<script lang="ts">
	import type { Product } from '$lib/types/Product';
	import { formatVND } from '$lib/utils/converters';
	import { expoInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import Rating from '../data-input/Rating.svelte';
	import Image from '../Image.svelte';

	const { product, index }: { product: Product; index?: number } = $props();
</script>

<a href="/shopping/product/{product.slug}" class="group">
	<div
		in:fly|global={{ y: 20, duration: 800, delay: 0 + (index ?? 0) * 50, easing: expoInOut }}
		class="flex h-full flex-col gap-1 rounded-field border bg-base-100 p-2 shadow duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
	>
		<figure class="hover-gallery">
			<Image
				src={product.thumbnailUrl}
				class="aspect-square w-full"
				rounded="rounded-selector"
				alt={product.name}
			/>
			{#each product.images.filter((image) => image.url !== product.thumbnailUrl) as image}
				<Image
					src={image.url}
					class="aspect-square w-full"
					rounded="rounded-selector"
					alt={product.name}
				/>
			{/each}
		</figure>

		<p class="mt-2 line-clamp-2 text-sm font-semibold">
			{product.name}
		</p>
		<div class="flex flex-wrap items-center justify-between">
			<div>
				{#if product.averageRating !== undefined}
					<Rating defaultValue={product.averageRating} readonly={true} />
				{:else}
					<span class="text-sm text-base-content/70 italic">
						<Rating defaultValue={0} readonly={true} />
					</span>
				{/if}
				<p class="text-xs text-base-content/70 italic">
					{#if product.ratingCount !== undefined}
						{product.ratingCount === 0
							? 'Chưa có đánh giá'
							: `${product.ratingCount} lượt đánh giá`}
					{:else}
						không có dữ liệu
					{/if}
				</p>
			</div>
			<div class="badge badge-xs badge-secondary">
				{product.categoryName}
			</div>
		</div>
		<div class="mt-1 flex items-center gap-2">
			<Image class="h-6 w-6 rounded-full" src={product.shopAvatar} alt={product.shopName} />
			<p class="text-sm font-bold tracking-tight text-secondary-content">
				{product.shopName ?? 'Unknown shop'}
			</p>
		</div>
		<p class="ml-1 font-serif text-xl font-black text-primary-content">
			{formatVND(product.price)}
		</p>
	</div>
</a>
