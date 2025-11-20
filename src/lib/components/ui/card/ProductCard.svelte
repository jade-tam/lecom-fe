<script lang="ts">
	import type { Product } from '$lib/types/Product';
	import { formatVND } from '$lib/utils/converters';
	import Image from '../Image.svelte';

	const { product }: { product: Product } = $props();
</script>

<a href="/shopping/product/{product.slug}" class="group">
	<div
		class="flex h-full flex-col gap-2 rounded-field border bg-base-100 p-3 shadow duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
	>
		<Image
			src={product.thumbnailUrl}
			class="h-38 w-full"
			rounded="rounded-selector"
			border=""
			alt={product.name}
		/>
		<p class="line-clamp-2 font-semibold">{product.name}</p>
		<div class="badge badge-sm badge-secondary">{product.categoryName}</div>
		<div class="flex items-center gap-2">
			<Image class="h-8 w-8 rounded-full" src={product.shopAvatar} alt={product.shopName} />
			<p class="text-sm">{product.shopName ?? 'Unknown shop'}</p>
		</div>
		<p class="ml-1 font-serif text-xl font-black">{formatVND(product.price)}</p>
	</div>
</a>
