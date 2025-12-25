<script lang="ts">
	import type { Shop } from '$lib/types/Shop';
	import Image from '../Image.svelte';

	const {
		shop
	}: {
		shop: Partial<Shop>;
	} = $props();
</script>

<div class="relative mt-4 overflow-hidden rounded-box border bg-base-100">
	<div class="flex flex-wrap gap-4 p-4">
		<div>
			<Image src={shop.shopAvatar} alt={shop.name} class="h-16 w-16 rounded-full" />
		</div>
		<div class="flex flex-1 flex-col gap-1">
			<h1 class="text-header3 text-lg">{shop.name}</h1>
			<p class="line-clamp-1 text-sm">{shop.description}</p>
		</div>
		<a href="/shopping/shop/{shop.id}" class="btn self-center btn-xs btn-primary max-md:w-full">
			<span class="icon-[mingcute--store-line]"></span>Xem cửa hàng
		</a>
	</div>
</div>
