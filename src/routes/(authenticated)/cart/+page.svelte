<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import FormAction from '$lib/components/wrapper/FormAction.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import type { Cart, ShopGroupedItems } from '$lib/types/Cart.js';
	import { formatVND } from '$lib/utils/converters.js';
	import showToast from '$lib/utils/showToast.js';
	import NumberFlow from '@number-flow/svelte';
	import { fade, slide } from 'svelte/transition';

	const { data, form } = $props();
	const cart = $derived(data.cart);

	// Track checked state for each productId
	let checked: Record<string, boolean> = $state({});

	// Initialize checked state when cart changes
	$effect(() => {
		if (cart) {
			for (const group of cart.items) {
				for (const item of group.items) {
					if (!(item.productId in checked)) checked[item.productId] = false;
				}
			}
		}
	});

	const selectedCart: Cart = $derived.by(() => {
		if (!cart) return { userId: '', items: [], subtotal: 0 };

		const selectedGroups: ShopGroupedItems[] = cart.items
			.map((group) => {
				const selectedItems = group.items.filter((item) => checked[item.productId]);
				const groupSubtotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);

				return selectedItems.length
					? {
							shopId: group.shopId,
							shopName: group.shopName,
							shopAvatar: group.shopAvatar,
							items: selectedItems,
							subtotal: groupSubtotal
						}
					: null;
			})
			.filter(Boolean) as ShopGroupedItems[];

		const subtotal = selectedGroups.reduce((sum, group) => sum + group.subtotal, 0);

		return {
			userId: cart.userId,
			items: selectedGroups,
			subtotal
		};
	});

	$effect(() => {
		if (form?.toastData) {
			if (form.toastData.type === 'success') {
				invalidate('cart');
			} else {
				showToast(form.toastData);
			}
		}
	});
</script>

<h1 class="my-2 text-center">Your Shopping Cart</h1>
{#if cart}
	<div class="grid grid-cols-12 gap-4 max-md:grid-cols-1">
		<div
			class="col-span-8 flex max-h-[1000px] flex-col gap-4 overflow-auto rounded-box border bg-base-100 p-4 max-md:col-span-1"
		>
			<div class="flex justify-between rounded-field bg-secondary px-3 py-2">
				<p class="text-sm font-bold">Product</p>
				<p class="text-sm font-bold">Subtotal</p>
			</div>
			{#if cart.items.length}
				{#each cart?.items as shopItemGroup (shopItemGroup.shopId)}
					<div class="flex flex-col" transition:slide>
						<!-- Shop label -->
						<div class="w-fit min-w-42 rounded-t-field bg-base-200 p-2">
							<div class="flex items-center gap-2">
								<Image
									class="h-6 w-6 rounded-selector"
									src={shopItemGroup.shopAvatar}
									alt={shopItemGroup.shopName}
								/>
								<p class="font-serif font-bold">{shopItemGroup.shopName}</p>
							</div>
						</div>
						<!-- Products grouped by shop -->
						<div class="rounded-tr-field rounded-b-field bg-base-200 p-2">
							{#each shopItemGroup.items as item (item.productId)}
								<div
									class="flex gap-2 rounded-field duration-200 {checked[item.productId]
										? 'bg-primary'
										: ''} p-2"
								>
									<input
										type="checkbox"
										class="checkbox checkbox-lg"
										bind:checked={checked[item.productId]}
									/>

									<Image
										class="h-28 w-28 shrink-0"
										src={item.productImage}
										alt={item.productName}
									/>
									<div class="flex grow flex-col justify-between">
										<a
											href={`/shopping/product/${item.productSlug}`}
											class="line-clamp-1 font-medium duration-100 hover:font-bold hover:underline"
											>{item.productName}</a
										>
										<div class="flex items-baseline gap-2">
											<p class="text-sm font-light text-base-content/70">Price:</p>
											<p class="font-serif font-bold text-base-content">
												{formatVND(item.unitPrice)}
											</p>
										</div>
										<div class="flex items-center">
											<FormAction
												action="?/updateItemCount"
												formData={{
													productId: item.productId,
													quantityChange: String(-1)
												}}
											>
												<button
													type="submit"
													class="btn btn-sm btn-secondary"
													onclick={() => null}
													disabled={item.quantity <= 1}>-</button
												>
											</FormAction>
											<span class="p-4 font-serif text-xl font-black">
												<NumberFlow value={item.quantity} />
											</span>
											<FormAction
												action="?/updateItemCount"
												formData={{
													productId: item.productId,
													quantityChange: String(1)
												}}
											>
												<button type="submit" class="btn btn-sm btn-secondary" onclick={() => null}
													>+</button
												>
											</FormAction>
										</div>
									</div>
									<div class="flex flex-col items-end">
										<p class="text-sm font-light text-base-content/70">Total:</p>
										<p class="font-serif text-xl font-bold">
											<NumberFlow value={item.lineTotal} format={formatVND} />
										</p>

										<FormConfirmDropdownAction
											label="Remove this item?"
											description="This item will be removed from your cart"
											action="?/deleteItem"
											confirmButtonIcon="icon-[fa7-solid--check-circle]"
											formData={{ productId: item.productId }}
										>
											<button
												type="button"
												class="btn mt-2 btn-square btn-sm btn-error"
												aria-label="remove item"
												><span class="icon-[fa7-solid--trash-alt]"></span></button
											>
										</FormConfirmDropdownAction>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{:else}
				<EmptyPlaceholder text="Your cart is empty" />{/if}
		</div>

		<div class="col-span-4 rounded-box border bg-base-100 p-4 max-md:col-span-1">
			<h2 class="text-header3">Order Summary</h2>
			<div class="mt-2 flex flex-col gap-2">
				{#if selectedCart.items.length}
					{#each selectedCart.items as shopItemGroup (shopItemGroup.shopId)}
						<div class="flex flex-col gap-1" transition:slide>
							<p class="font-serif font-bold">{shopItemGroup.shopName}</p>
							{#each shopItemGroup.items as item (item.productId)}
								<div class="flex gap-2">
									<Image
										class="h-12 w-12 shrink-0"
										src={item.productImage}
										alt={item.productName}
									/>
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
				<button
					onclick={() => goto(resolve('/cart/checkout'))}
					class="btn btn-primary"
					disabled={!selectedCart.items.length}>Proceed to checkout</button
				>
			</div>
		</div>
	</div>
{/if}
