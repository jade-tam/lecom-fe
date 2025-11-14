<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import FormAction from '$lib/components/wrapper/FormAction.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import { formatVND } from '$lib/utils/converters.js';
	import showToast from '$lib/utils/showToast.js';

	const { data, form } = $props();
	const cart = $derived(data.cart);

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
	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-8 flex flex-col gap-4 rounded-box border bg-base-100 p-4">
			<div class="flex justify-between rounded-field bg-secondary px-3 py-2">
				<p class="text-sm font-bold">Product</p>
				<p class="text-sm font-bold">Subtotal</p>
			</div>
			{#if cart.items.length}
				{#each cart?.items as item (item.productId)}
					<div class="flex gap-2">
						<Image class="h-24 w-24 shrink-0" src={item.productImage} alt={item.productName} />
						<div class="flex grow flex-col justify-between">
							<a
								href={`/shopping/product/${item.productSlug}`}
								class="line-clamp-1 font-medium duration-100 hover:font-bold hover:underline"
								>{item.productName}</a
							>
							<p class="font-serif font-bold text-base-content">
								{formatVND(item.unitPrice)}
							</p>
							<div class="flex items-center">
								<FormAction
									action="?/updateItemCount"
									formData={{
										productId: item.productId,
										quantity: String(-1)
									}}
								>
									<button
										type="submit"
										class="btn btn-sm btn-secondary"
										onclick={() => null}
										disabled={item.quantity <= 1}>-</button
									>
								</FormAction>
								<span class="p-4 font-serif text-xl font-black">{item.quantity}</span>
								<FormAction
									action="?/updateItemCount"
									formData={{
										productId: item.productId,
										quantity: String(1)
									}}
								>
									<button type="submit" class="btn btn-sm btn-secondary" onclick={() => null}
										>+</button
									>
								</FormAction>
							</div>
						</div>
						<div class="flex flex-col items-end">
							<p class="font-serif text-xl font-bold">
								{formatVND(item.quantity * item.unitPrice)}
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
									aria-label="remove item"><span class="icon-[fa7-solid--trash-alt]"></span></button
								>
							</FormConfirmDropdownAction>
						</div>
					</div>
				{/each}
			{:else}
				<EmptyPlaceholder text="Your cart is empty" />{/if}
		</div>
		<div class="col-span-4 rounded-box border bg-base-100 p-4">
			<h2 class="text-header3">Order Summary</h2>
			<div class="mt-2 flex flex-col gap-2">
				{#each cart?.items as item (item.productId)}
					<div class="flex gap-2">
						<Image class="h-12 w-12 shrink-0" src={item.productImage} alt={item.productName} />
						<div class="flex w-full flex-col">
							<p class="line-clamp-1 text-sm">{item.productName}</p>
							<div class="flex justify-between">
								<p class="text-xs font-light text-base-content/70">
									{item.quantity} × {formatVND(item.unitPrice)}
								</p>
								<p class="mt-1 font-serif font-bold">
									{formatVND(item.quantity * item.unitPrice)}
								</p>
							</div>
						</div>
					</div>
				{/each}
				<div class="divider my-0"></div>
				<div class="flex items-end justify-between">
					<p class="font-bold">Total:</p>
					<p class="font-serif text-2xl font-bold text-primary-content">
						{formatVND(cart?.subtotal)}
					</p>
				</div>
				<button
					onclick={() => goto(resolve('/cart/checkout'))}
					class="btn btn-primary"
					disabled={!cart.items.length}>Proceed to checkout</button
				>
			</div>
		</div>
	</div>
{/if}
