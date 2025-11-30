<script lang="ts">
	import type { Product } from '$lib/types/Product';
	import { formatVND } from '$lib/utils/converters';
	import Rating from '../data-input/Rating.svelte';
	import Image from '../Image.svelte';

	const { product }: { product: Product } = $props();
</script>

<a href="/shopping/product/{product.slug}" class="group">
	<div
		class="flex h-full flex-col gap-1 rounded-field border bg-base-100 p-3 shadow duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
	>
		<Image
			src={product.thumbnailUrl}
			class="h-38 w-full"
			rounded="rounded-selector"
			alt={product.name}
			viewTransitionName={`product-image-${product.id}`}
		/>
		<p
			class="mt-2 line-clamp-2 text-sm font-semibold"
			style={`view-transition-name: product-name-${product.id};`}
		>
			{product.name}
		</p>
		<div class="flex items-center justify-between">
			<div style={`view-transition-name: product-rating-${product.id};`}>
				<Rating defaultValue={1.4} readonly={true} />
			</div>
			<div
				class="badge badge-xs badge-secondary"
				style={`view-transition-name: product-category-${product.id};`}
			>
				{product.categoryName}
			</div>
		</div>
		<div class="flex items-center gap-2">
			<Image class="h-6 w-6 rounded-full" src={product.shopAvatar} alt={product.shopName} />
			<p class="text-sm font-bold tracking-tight text-secondary-content">
				{product.shopName ?? 'Unknown shop'}
			</p>
		</div>
		<p
			class="ml-1 font-serif text-xl font-black text-primary-content"
			style={`view-transition-name: product-price-${product.id};`}
		>
			{formatVND(product.price)}
		</p>
	</div>
</a>
