<script lang="ts">
	import { slide } from 'svelte/transition';
	import Image from '$lib/components/ui/Image.svelte';
	import type { Cart } from '$lib/types/Cart';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import { formatVND } from '$lib/utils/converters';
	import NumberFlow from '@number-flow/svelte';
	import type { Voucher } from '$lib/types/Voucher';

	const {
		selectedCart,
		selectedVoucher,
		shippingFee
	}: { selectedCart: Cart; selectedVoucher?: Voucher; shippingFee?: number } = $props();

	const discountAmount = $derived(
		selectedVoucher
			? Math.min(
					selectedVoucher.discountType === 'FixedAmount'
						? selectedVoucher.discountValue
						: (selectedCart.subtotal * selectedVoucher.discountValue) / 100,
					selectedVoucher.maxDiscountAmount ?? Infinity
				)
			: 0
	);
</script>

<h2 class="text-header3">Tổng quan đơn hàng</h2>
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
		<EmptyPlaceholder class="h-24" text="Chọn sản phẩm để thanh toán" />
	{/if}
	<div class="divider my-0"></div>

	<div class="flex items-end justify-between">
		<p class="">Tổng phí sản phẩm</p>
		<p class="font-serif font-bold">
			<NumberFlow value={selectedCart.subtotal} format={formatVND} /> đ
		</p>
	</div>

	<div class="flex items-end justify-between">
		<p class="">Phiếu giảm giá</p>
		<p class="font-serif font-bold text-success-content">
			-<NumberFlow value={discountAmount} format={formatVND} /> đ
		</p>
	</div>

	<div class="flex items-end justify-between">
		<p class="">Phí vận chuyển</p>
		<p class="font-serif font-bold text-info-content">
			{#if shippingFee}
				<NumberFlow value={shippingFee} format={formatVND} /> đ
			{:else}
				---
			{/if}
		</p>
	</div>

	<div class="divider my-0"></div>

	<div class="flex items-end justify-between">
		<p class="font-bold">Tổng thanh toán</p>
		<p class="font-serif text-2xl font-bold text-primary-content">
			<NumberFlow
				value={Math.max(0, selectedCart.subtotal - discountAmount + (shippingFee ?? 0))}
				format={formatVND}
			/> đ
		</p>
	</div>
</div>
