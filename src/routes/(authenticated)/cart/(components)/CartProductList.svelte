<script lang="ts">
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import FormAction from '$lib/components/wrapper/FormAction.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import type { Cart } from '$lib/types/Cart';
	import { formatVND } from '$lib/utils/converters';
	import NumberFlow from '@number-flow/svelte';
	import { slide } from 'svelte/transition';

	const { cart, checked = $bindable() }: { cart: Cart; checked: Record<string, boolean> } =
		$props();
</script>

<div class="flex justify-between rounded-field bg-secondary px-3 py-2">
	<p class="text-sm font-bold">Sản phẩm</p>
	<p class="text-sm font-bold">Tạm tính</p>
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

						<Image class="h-28 w-28 shrink-0" src={item.productImage} alt={item.productName} />
						<div class="flex grow flex-col justify-between">
							<a
								href={`/shopping/product/${item.productSlug}`}
								class="line-clamp-1 font-medium duration-100 hover:font-bold hover:underline"
								>{item.productName}</a
							>
							<div class="flex items-baseline gap-2">
								<p class="text-sm font-light text-base-content/70">Giá:</p>
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
										class="btn btn-square btn-sm btn-secondary"
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
									<button
										type="submit"
										class="btn btn-square btn-sm btn-secondary"
										onclick={() => null}>+</button
									>
								</FormAction>
							</div>
						</div>
						<div class="flex flex-col items-end">
							<p class="text-sm font-light text-base-content/70">Thành tiền:</p>
							<p class="font-serif text-xl font-bold">
								<NumberFlow value={item.lineTotal} format={formatVND} />
							</p>

						<FormConfirmPopoverButton
							action="?/deleteItem"
							formData={{ productId: item.productId }}
							popoverId="delete-item-{item.productId}"
							openButtonProps={{ class: 'btn mt-2 btn-square btn-sm btn-error' }}
							dropdownClass="dropdown-bottom dropdown-end"
							dropdownContent={{
								label: 'Xóa sản phẩm này?',
								description: 'Sản phẩm này sẽ bị xóa khỏi giỏ hàng của bạn',
								confirmBtnClass: 'btn-error',
								confirmBtnIcon: 'icon-[fa7-solid--check-circle]',
								confirmBtnText: 'Xóa'
							}}
						>
							<span class="icon-[fa7-solid--trash-alt]"></span>
						</FormConfirmPopoverButton>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
{:else}
	<EmptyPlaceholder text="Giỏ hàng của bạn đang trống" />
{/if}
