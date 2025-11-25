<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import { SELECTED_CART_SESSION } from '$lib/consts/contexts';
	import type { Cart, ShopGroupedItems } from '$lib/types/Cart.js';
	import showToast from '$lib/utils/showToast.js';
	import CartProductList from './(components)/CartProductList.svelte';
	import OrderSummary from './(components)/OrderSummary.svelte';

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

	function handleProceedToCheckout() {
		sessionStorage.setItem(SELECTED_CART_SESSION, JSON.stringify(selectedCart));
		goto(resolve('/cart/checkout'));
	}
</script>

<AnimatedDiv animateVars={{ translateY: -16 }}>
	<h1 class="my-2 text-center">Giỏ hàng của bạn</h1>
</AnimatedDiv>

{#if cart}
	<div class="grid grid-cols-12 gap-2 max-md:grid-cols-1">
		<AnimatedDiv
			animateVars={{ translateY: 16, delay: 0.1 }}
			class="col-span-8 flex max-h-[1000px] flex-col gap-4 overflow-auto rounded-box border bg-base-100 p-4 max-md:col-span-1"
		>
			<CartProductList {cart} bind:checked />
		</AnimatedDiv>

		<AnimatedDiv
			animateVars={{ translateY: 16, delay: 0.2 }}
			class="col-span-4 rounded-box border bg-base-100 p-4 max-md:col-span-1"
		>
			<OrderSummary {selectedCart} />
			<button
				onclick={() => handleProceedToCheckout()}
				class="btn mt-2 btn-block btn-primary"
				disabled={!selectedCart.items.length}>Tiến hành thanh toán</button
			>
		</AnimatedDiv>
	</div>
{/if}
