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
		<Image
			src={product.thumbnailUrl}
			class="aspect-square w-full"
			rounded="rounded-selector"
			alt={product.name}
		/>
		<p class="mt-2 line-clamp-2 text-sm font-semibold">
			{product.name}
		</p>
		<div class="flex flex-wrap items-center justify-between">
			<div>
				<Rating defaultValue={1.4} readonly={true} />
			</div>
			<div class="badge badge-xs badge-secondary">
				{product.categoryName}
			</div>
		</div>
		<div class="flex items-center gap-2">
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
