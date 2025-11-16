<script lang="ts">
	import { slide } from 'svelte/transition';
	import Image from '$lib/components/ui/Image.svelte';
	import type { Cart } from '$lib/types/Cart';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import { formatVND } from '$lib/utils/converters';
	import NumberFlow from '@number-flow/svelte';

	const { selectedCart }: { selectedCart: Cart } = $props();
</script>

<h2 class="text-header3">Order Summary</h2>
<div class="mt-2 flex flex-col gap-2">
	{#if selectedCart.items.length}
		{#each selectedCart.items as shopItemGroup (shopItemGroup.shopId)}
			<div class="flex flex-col gap-1" transition:slide>
				<p class="font-serif font-bold">{shopItemGroup.shopName}</p>
				{#each shopItemGroup.items as item (item.productId)}
					<div class="flex gap-2">
						<Image class="h-12 w-12 shrink-0" src={item.productImage} alt={item.productName} />
						<div class="flex w-full flex-col">
							<p class="line-clamp-1 text-sm">{item.productName}</p>
							<div class="flex justify-between">
								<p class="text-xs font-light text-base-content/70">
									<NumberFlow value={item.quantity} /> × {formatVND(item.unitPrice)}
								</p>
								<p class="mt-1 font-serif font-bold">
									<NumberFlow value={item.lineTotal} format={formatVND} />
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	{:else}
		<EmptyPlaceholder class="h-24" text="Select item to checkout" />
	{/if}
	<div class="divider my-0"></div>
	<div class="flex items-end justify-between">
		<p class="font-bold">Total:</p>
		<p class="font-serif text-2xl font-bold text-primary-content">
			<NumberFlow value={selectedCart.subtotal} format={formatVND} />
		</p>
	</div>
</div>
